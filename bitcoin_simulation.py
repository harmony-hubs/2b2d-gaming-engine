import pandas as pd
import numpy as np
import random
import sys

# Set seeds for reproducibility
np.random.seed(123)
random.seed(123)

def simulate_bitcoin_price(days=60, start_price=50000, volatility=0.03):
    """
    Simulates Bitcoin price using Geometric Brownian Motion.
    """
    dt = 1  # Time step (1 day)
    mu = 0.002  # Stronger daily upward drift assumption to encourage growth
    sigma = volatility # Daily volatility

    prices = [start_price]
    for _ in range(days - 1):
        price = prices[-1]
        # Calculate daily return using GBM formula
        drift = (mu - 0.5 * sigma**2) * dt
        shock = sigma * np.sqrt(dt) * np.random.normal()
        new_price = price * np.exp(drift + shock)
        prices.append(new_price)

    return prices

class Portfolio:
    def __init__(self, initial_cash=100000.0, name="Trader"):
        self.initial_cash = initial_cash
        self.cash = initial_cash
        self.btc = 0.0
        self.name = name
        self.history = []

    def buy(self, price, day):
        if self.cash > 0:
            btc_bought = self.cash / price
            self.btc = btc_bought
            self.cash = 0
            self.history.append({'Day': day, 'Action': 'BUY', 'Price': price, 'Value': self.get_value(price)})
            return True
        return False

    def sell(self, price, day):
        if self.btc > 0:
            cash_received = self.btc * price
            self.cash = cash_received
            self.btc = 0
            self.history.append({'Day': day, 'Action': 'SELL', 'Price': price, 'Value': self.cash})
            return True
        return False

    def hold(self, price, day):
        # self.history.append({'Day': day, 'Action': 'HOLD', 'Price': price, 'Value': self.get_value(price)})
        pass

    def get_value(self, price):
        return self.cash + (self.btc * price)

    def status(self, price):
        val = self.get_value(price)
        holding_str = f"{self.btc:.4f} BTC" if self.btc > 0 else "$0.00 BTC"
        cash_str = f"${self.cash:,.2f}"
        return f"{self.name} Value: ${val:,.2f} | Cash: {cash_str} | Holdings: {holding_str}"

def run_game():
    print("Welcome to the Bitcoin Trading Game!")
    print("Beat the Bot! The Bot follows a Golden Cross strategy (MA7 > MA30 = Buy).")
    print("You start with $100,000. Can you do better?")
    print("-" * 60)

    days = 60
    prices = simulate_bitcoin_price(days=days)

    # Create DataFrame
    df = pd.DataFrame({
        'Day': range(1, days + 1),
        'Price': prices
    })

    # Calculate Moving Averages
    df['MA7'] = df['Price'].rolling(window=7).mean()
    df['MA30'] = df['Price'].rolling(window=30).mean()

    user_portfolio = Portfolio(name="You")
    bot_portfolio = Portfolio(name="Bot")

    # Bot state
    bot_position = None # None, 'LONG'

    print(f"{'Day':<4} | {'Price':<10} | {'MA7':<10} | {'MA30':<10}")
    print("-" * 45)

    for i in range(len(df)):
        row = df.iloc[i]
        price = row['Price']
        ma7 = row['MA7']
        ma30 = row['MA30']
        day = int(row['Day'])

        ma7_str = f"${ma7:,.2f}" if not np.isnan(ma7) else "N/A"
        ma30_str = f"${ma30:,.2f}" if not np.isnan(ma30) else "N/A"

        print(f"\n{day:<4} | ${price:,.2f}  | {ma7_str:<10} | {ma30_str:<10}")
        print(user_portfolio.status(price))

        # User Input
        valid_input = False
        while not valid_input:
            try:
                choice = input("Action? [B]uy, [S]ell, [H]old: ").strip().lower()
                if choice.startswith('b'):
                    if user_portfolio.buy(price, day):
                        print(">> You BOUGHT Bitcoin.")
                    else:
                        print(">> You are already fully invested.")
                    valid_input = True
                elif choice.startswith('s'):
                    if user_portfolio.sell(price, day):
                        print(">> You SOLD Bitcoin.")
                    else:
                        print(">> You have no Bitcoin to sell.")
                    valid_input = True
                elif choice.startswith('h') or choice == '':
                    user_portfolio.hold(price, day)
                    print(">> You HELD.")
                    valid_input = True
                else:
                    print("Invalid input. Please enter B, S, or H.")
            except (EOFError, KeyboardInterrupt):
                print("\nExiting game...")
                sys.exit(0)

        # Bot Logic
        bot_action = "HOLD"
        if not np.isnan(ma7) and not np.isnan(ma30):
            if bot_position != 'LONG' and ma7 > ma30:
                bot_portfolio.buy(price, day)
                bot_position = 'LONG'
                bot_action = "BUY"
            elif bot_position == 'LONG' and ma7 < ma30:
                bot_portfolio.sell(price, day)
                bot_position = None
                bot_action = "SELL"

        print(f"Bot Action: {bot_action}")
        print("-" * 45)

    final_price = df.iloc[-1]['Price']
    user_final = user_portfolio.get_value(final_price)
    bot_final = bot_portfolio.get_value(final_price)

    print("\n" + "="*30)
    print("GAME OVER")
    print("="*30)
    print(f"Final Bitcoin Price: ${final_price:,.2f}")
    print(f"Your Final Balance:  ${user_final:,.2f} ({((user_final - 100000)/100000)*100:+.2f}%)")
    print(f"Bot Final Balance:   ${bot_final:,.2f} ({((bot_final - 100000)/100000)*100:+.2f}%)")

    if user_final > bot_final:
        print("\n🏆 YOU WON! You beat the trading bot! 🏆")
    elif user_final < bot_final:
        print("\n🤖 THE BOT WON! Better luck next time. 🤖")
    else:
        print("\n🤝 IT'S A TIE!")

if __name__ == "__main__":
    run_game()
