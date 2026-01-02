import pandas as pd
import numpy as np
import random

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

def run_simulation():
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

    # Initialize Portfolio
    initial_cash = 100000.0
    cash = initial_cash
    btc_holdings = 0.0
    portfolio_value = initial_cash

    position = None # None, 'LONG'

    print(f"{'Day':<5} | {'Price':<10} | {'MA7':<10} | {'MA30':<10} | {'Action':<10} | {'Portfolio Value':<15}")
    print("-" * 75)

    trades = []

    for i in range(len(df)):
        row = df.iloc[i]
        price = row['Price']
        ma7 = row['MA7']
        ma30 = row['MA30']
        day = int(row['Day'])
        action = "Hold"

        # We need both MAs to be available to make a decision
        if not np.isnan(ma7) and not np.isnan(ma30):

            # Golden Cross: MA7 crosses above MA30
            # We look at previous day to confirm crossover, but for simplicity in this loop
            # we check current state vs position.

            # If we are not holding and MA7 > MA30 -> BUY
            if position != 'LONG' and ma7 > ma30:
                btc_holdings = cash / price
                cash = 0
                position = 'LONG'
                action = "BUY"
                trades.append({'Day': day, 'Type': 'BUY', 'Price': price, 'Value': btc_holdings * price})

            # If we are holding and MA7 < MA30 -> SELL
            elif position == 'LONG' and ma7 < ma30:
                cash = btc_holdings * price
                btc_holdings = 0
                position = None
                action = "SELL"
                trades.append({'Day': day, 'Type': 'SELL', 'Price': price, 'Value': cash})

        # Update portfolio value
        current_value = cash + (btc_holdings * price)

        print(f"{day:<5} | ${price:,.2f}  | "
              f"{('$' + f'{ma7:,.2f}') if not np.isnan(ma7) else 'N/A':<10} | "
              f"{('$' + f'{ma30:,.2f}') if not np.isnan(ma30) else 'N/A':<10} | "
              f"{action:<10} | ${current_value:,.2f}")

    final_value = cash + (btc_holdings * df.iloc[-1]['Price'])
    print("-" * 75)
    print(f"Final Portfolio Value: ${final_value:,.2f}")
    print(f"Return: {((final_value - initial_cash) / initial_cash) * 100:.2f}%")
    print(f"Total Trades: {len(trades)}")

if __name__ == "__main__":
    run_simulation()
