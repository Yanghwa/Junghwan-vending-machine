import * as readline from "readline";

enum Drink {
    COLA = "Cola",
    WATER = "Water",
    COFFEE = "Coffee",
}

enum PaymentMethod {
    CASH = "Cash",
    CARD = "Credit",
}

interface DrinkInfo {
    name: Drink;
    price: number;
    stock: number;
}

// change maintance class
class CashInventory {
    private inventory: Map<number, number>;

    constructor(initialInventory: [number, number][]) {
        this.inventory = new Map(initialInventory);
    }

    // method to add cash for change stock
    public addCash(cashType: number, quantity: number): void {
        const currentQuantity = this.inventory.get(cashType) || 0;
        this.inventory.set(cashType, currentQuantity + quantity);
    }

    // method to remove cash for change stock
    public removeCash(cashType: number, quantity: number): boolean {
        const currentQuantity = this.inventory.get(cashType) || 0;
        if (currentQuantity >= quantity) {
            this.inventory.set(cashType, currentQuantity - quantity);
            return true;
        }
        return false;
    }

    // method to calculate change
    public getChange(amount: number): Map<number, number> | null {
        const change = new Map<number, number>();
        let remainingAmount = amount;
        const cashTypeInventory = Array.from(this.inventory.keys()).sort(
            (a, b) => b - a
        );

        // from large unit to small
        for (const cashType of cashTypeInventory) {
            const availableQuantity = this.inventory.get(cashType) || 0;
            const neededQuantity = Math.min(
                Math.floor(remainingAmount / cashType),
                availableQuantity
            );

            if (neededQuantity > 0) {
                change.set(cashType, neededQuantity);
                remainingAmount -= cashType * neededQuantity;
            }

            if (remainingAmount === 0) break;
        }

        if (remainingAmount > 0) return null; // can't give change

        // if inventory has enough change, remove cash from inventory
        change.forEach((quantity, cashType) => {
            this.removeCash(cashType, quantity);
        });

        return change;
    }

    // total inventory cash
    public getTotalAmount(): number {
        return Array.from(this.inventory.entries()).reduce(
            (total, [cashType, quantity]) => {
                return total + cashType * quantity;
            },
            0
        );
    }
}

// vendingmachine calss
class VendingMachine {
    private drinks: Map<Drink, DrinkInfo>;
    private cashInventory: CashInventory;
    private rl: readline.Interface;

    constructor() {
        // init stock for drink
        this.drinks = new Map([
            [Drink.COLA, { name: Drink.COLA, price: 1100, stock: 10 }],
            [Drink.WATER, { name: Drink.WATER, price: 600, stock: 10 }],
            [Drink.COFFEE, { name: Drink.COFFEE, price: 700, stock: 10 }],
        ]);

        this.rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
        });

        // init cash inventory
        this.cashInventory = new CashInventory([
            [10000, 5], // 50,000
            [5000, 10], // 50,000
            [1000, 20], // 20,000
            [500, 50], // 25,000
            [100, 100], // 10,000
        ]);
    }

    // method to start vending machine
    public async start(): Promise<void> {
        while (true) {
            const selectedDrink = await this.displayAvailableDrinksAndSelect();
            if (!selectedDrink) continue;

            console.log(
                `You chose ${selectedDrink.name}. Price is ${selectedDrink.price} KRW.`
            );

            const paymentMethod = await this.selectPaymentMethod();
            if (!paymentMethod) continue;

            let paymentSuccessful: boolean;
            if (paymentMethod === PaymentMethod.CASH) {
                paymentSuccessful = await this.processCashPayment(
                    selectedDrink.price
                );
            } else {
                paymentSuccessful = await this.processCardPayment();
            }

            if (paymentSuccessful) {
                this.giveDrink(selectedDrink);
                console.log("Your payment was successful.");
            }
            const userChoice = await this.getUserChoice(
                "Do you want to buy more? (Y/N): "
            );
            if (!userChoice.toLowerCase().startsWith("y")) {
                break;
            }
        }
        this.rl.close();
    }

    // method to show available drink
    private async displayAvailableDrinksAndSelect(): Promise<DrinkInfo | null> {
        console.log("Available Drink list:");
        const availableDrinks = Array.from(this.drinks.values()).filter(
            (drink) => drink.stock > 0
        );

        availableDrinks.forEach((drink, index) => {
            console.log(
                `${index + 1}. ${drink.name}: ${drink.price} KRW (stock: ${
                    drink.stock
                })`
            );
        });

        const selection = await this.getUserInput(
            "Chose the drink you want (0: Cancel): "
        );
        const selectedIndex = parseInt(selection) - 1;

        if (selectedIndex === -1) {
            console.log("Cancel.");
            return null;
        }

        if (selectedIndex >= 0 && selectedIndex < availableDrinks.length) {
            return availableDrinks[selectedIndex];
        } else {
            console.log("Wrong selection");
            return null;
        }
    }

    // method to choose payment
    private async selectPaymentMethod(): Promise<PaymentMethod | null> {
        const selection = await this.getUserInput(
            "Choose payment method (1: Cash, 2: Credit, 0: Cancel): "
        );
        switch (selection) {
            case "1":
                return PaymentMethod.CASH;
            case "2":
                return PaymentMethod.CARD;
            case "0":
                console.log("Cancel.");
                return null;
            default:
                console.log("Wrong selection.");
                return null;
        }
    }

    // method to handle cash payment
    private async processCashPayment(drinkPrice: number): Promise<boolean> {
        let insertedAmount = 0;
        const insertedCash = new Map<number, number>();

        while (true) {
            const [cashType, quantity] = await this.getUserCashInput();
            if (cashType === 0) {
                this.returnInsertedCash(insertedCash);
                return false; // cancel
            }

            insertedAmount += cashType * quantity;
            insertedCash.set(
                cashType,
                (insertedCash.get(cashType) || 0) + quantity
            );

            if (insertedAmount >= drinkPrice) {
                const changeAmount = insertedAmount - drinkPrice;
                const change = this.cashInventory.getChange(changeAmount);

                if (change) {
                    this.provideChange(change);
                    // cash to stock
                    insertedCash.forEach((qty, denom) =>
                        this.cashInventory.addCash(denom, qty)
                    );
                    return true; // payment succeed
                } else {
                    console.log("We are out of cash.");
                    const choice = await this.getUserChoice(
                        "1: Try with accurate cash, 2: Cancel"
                    );
                    if (choice === "1") {
                        this.returnInsertedCash(insertedCash);
                        insertedAmount = 0;
                        insertedCash.clear();
                        continue;
                    } else {
                        this.returnInsertedCash(insertedCash);
                        return false; // cancel
                    }
                }
            } else {
                console.log(
                    `You need ${drinkPrice - insertedAmount} KRW more.`
                );
                const choice = await this.getUserChoice(
                    "1: Keep going, 2: Cancel"
                );
                if (choice === "2") {
                    this.returnInsertedCash(insertedCash);
                    return false; // cancel
                }
            }
        }
    }

    // method to handle credit payment
    private async processCardPayment(): Promise<boolean> {
        console.log("Credit payment");
        const isSuccessful = Math.random() < 0.9; // 90% success, random test
        if (isSuccessful) {
            console.log("Your payment was successful");
            return true;
        } else {
            console.log("Failed, Try again");
            return false;
        }
    }

    // method to give drink
    private giveDrink(drink: DrinkInfo): void {
        console.log(`${drink.name} is ready.`);
        const updatedStock = this.drinks.get(drink.name)!.stock - 1;
        this.drinks.set(drink.name, { ...drink, stock: updatedStock });
    }

    // method to give change
    private provideChange(change: Map<number, number>): void {
        console.log("Here is change:");
        change.forEach((quantity, cashType) => {
            console.log(`${cashType} KRW: ${quantity}`);
        });
    }

    // method to return cash
    private returnInsertedCash(insertedCash: Map<number, number>): void {
        console.log("Return cash:");
        insertedCash.forEach((quantity, cashType) => {
            console.log(`${cashType} KRW: ${quantity}`);
        });
    }

    // method to handle cash input
    private async getUserCashInput(): Promise<[number, number]> {
        const cashType = parseInt(
            await this.getUserInput(
                "What unit do you want to use (10000, 5000, 1000, 500, 100) (0: Cancel): "
            )
        );
        if (cashType === 0) return [0, 0];
        if (![10000, 5000, 1000, 500, 100].includes(cashType)) {
            console.log("Wrong selection.");
            return [0, 0];
        }
        const quantity = parseInt(
            await this.getUserInput("Type how many you want to put: ")
        );
        if (isNaN(quantity) || quantity <= 0) {
            console.log("Wrong selection.");
            return [0, 0];
        }
        return [cashType, quantity];
    }

    // method to handle user select
    private async getUserChoice(prompt: string): Promise<string> {
        return this.getUserInput(prompt);
    }

    // user input from cmd line
    private getUserInput(prompt: string): Promise<string> {
        return new Promise((resolve) => {
            this.rl.question(prompt, (answer) => {
                resolve(answer);
            });
        });
    }
}

const vendingMachine = new VendingMachine();
vendingMachine.start();
