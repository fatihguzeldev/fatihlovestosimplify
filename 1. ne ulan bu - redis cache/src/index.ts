import express from "express";
import Redis from "ioredis";

const app = express();
const PORT = 3000;

// redis setup
const redis = new Redis({
  host: "localhost",
  port: 6379,
  db: 0,
});

redis.on("connect", () => {
  console.log("redis bağlantısı başarılı.");
});

redis.on("error", (error) => {
  console.error("redis bağlantı hatası:", error);
});

interface IUser {
  id: number;
  name: string;
  age: number;
}

// mock veritabanı
const fakeDatabase: {
  [key: string]: IUser;
} = {
  "1": { id: 1, name: "John Doe", age: 30 },
  "2": { id: 2, name: "Jane Smith", age: 25 },
};

// getters

const cacheUser = async (userId: string, user: IUser) => {
  try {
    // redis cache'e user'ı ekliyoruz, 60 saniye sonra cache'den silinecek
    redis.set(userId, JSON.stringify(user), "EX", 60);
  } catch (error) {
    console.error("redis cache hatası:", error);
  }
};

const getCachedUser = async (userId: string) => {
  try {
    const cachedUser = await redis.get(userId);

    return cachedUser ? JSON.parse(cachedUser) : null;
  } catch (error) {
    console.error("redis cache hatası:", error);
    return null;
  }
};

const getUser = async (userId: string): Promise<IUser> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(fakeDatabase[userId]);
    }, 1000); // 1000ms gecikme: veritabanından veriyi çekmek 1000ms sürüyor I/O işlemi
  });
};

// endpointler
app.get("/user/:id", async (req, res) => {
  const userId = req.params.id;

  try {
    const user = await getUser(userId);
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ error: "user not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "internal server error" });
  }
});

app.get("/cache/user/:id", async (req, res) => {
  const userId = req.params.id;

  try {
    let user = await getCachedUser(userId);

    if (!user) {
      // cache miss
      user = await getUser(userId);

      if (user) {
        await cacheUser(userId, user);
      }
    } else {
      // cache hit
    }

    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ error: "user not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "internal server error" });
  }
});

app.listen(PORT, () => {
  console.log(`server running on http://localhost:${PORT}`);
});
