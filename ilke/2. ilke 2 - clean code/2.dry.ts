enum LogAction {
  LOGIN = 'logged in',
  LOGOUT = 'logged out',
  SUBSCRIPTION_CANCEL = 'canceled subscription',
  TICKET_OPENED = 'opened a ticket',
}

class Logger {
  async logAction(action: LogAction, userId: number) {
    const user = await this.getUser(userId);

    const message = `${user.name} ${action}`

    await this.saveLog(message);
  }

  // async login(userId: number) {
  //   const user = await this.getUser(userId);

  //   await this.saveLog(`${user.name} logged in`);
  // }

  // async logout(userId: number) {
  //   const user = await this.getUser(userId);

  //   await this.saveLog(`${user.name} logged out`);
  // }

  // async subscriptionCancel(userId: number) {
  //   const user = await this.getUser(userId);

  //   await this.saveLog(`${user.name} canceled subscription`);
  // }

  // async ticketOpened(userId: number) {
  //   const user = await this.getUser(userId);

  //   await this.saveLog(`${user.name} opened a ticket`);
  // }

  // mock db call
  private async getUser(userId: number) {
    return { id: userId, name: `User#${userId}` };
  }

  private async saveLog(message: string) {
    console.log(`[LOG] ${message}`);
  }
}
