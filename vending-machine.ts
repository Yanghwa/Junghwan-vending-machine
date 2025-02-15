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
class VendingMachine {}
