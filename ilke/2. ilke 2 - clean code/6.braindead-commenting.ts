function check(value: number): boolean {
  // burada fonksiyon, bir değer alıyor
  if (value > 10) { // önce değerin 10'dan büyük olup olmadığına bakıyoruz
    // eğer 10'dan büyükse, true döndürüyoruz
    return true;
  } else { // eğer değer 10'dan küçük veya eşitse
    // burada false döndürüyoruz
    return false;
  }
}