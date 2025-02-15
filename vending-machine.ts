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
class CashInventory {}

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
        this.cashInventory = new CashInventory();
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
}

const vendingMachine = new VendingMachine();
vendingMachine.start();
