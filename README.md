# Junghwan Yang Vending machine

### Installation

1. Clone the repository:
   git clone https://github.com/your-username/your-vending-machine-project.git

2. Navigate to the project directory:
   cd your-vending-machine-project

3. Install dependencies:
   yarn

### Running the Project

1. Compile the TypeScript code:
   yarn build

2. Run the compiled JavaScript:
   yarn start

### User Manual

1. When the program starts, you'll see a list of available drinks.
2. Enter the number corresponding to the drink you want to purchase.
3. Choose your payment method (cash or credit card).
4. If you chose cash:

    a. Enter the the bill/coin you're inserting.

    b. Enter the quantity of input of a.

    c. Repeat until you've inserted enough money or choose to cancel.

5. If you chose credit card, the payment will be processed automatically.
6. If the payment is successful, you'll receive your drink and any change (for cash payments).
7. You'll be asked if you want to make another purchase.
8. To exit the program, choose not to make another purchase when prompted.

### Notes

-   The vending machine starts with a limited stock of drinks and change. If it runs out of either, you may not be able to complete your purchase.
-   Credit card payments have a 90% success rate for demonstration purposes.
-   You can cancel your purchase at various points by selecting the appropriate option.

### Process how to make it work

1. Requirement
    1. kinds of drinks define (name: price)
    - Cola: 1,100
    - Water: 600
    - Coffee: 700
    - stock of drinks at the beginning
    2. kinds of payments define
    - Cash: [100, 500, 5,000, 10,000]
    - Credit
    3. main function define
    - function to show stocks
    - function to choose drink
    - function to pay
    - function to maintain stock
    - function to change
    - function to cancel
    4. exception define
    - lack of change
    - fail to use credit
2. System Design
    1. process define
    - show stocks -> user choose drink -> choose payment method -> payment -> change
    2. detail process
    - show stocks: check stocks and list available drinks
    - user choose drink: user reserve one drink by selection
    - choose payment method: user choose credit or cash
    - payment:
        - credit: pass or fail
            - pass: decrease stock
            - fail: return to show stocks
        - cash: pass of fail
            - pass: return change
            - fail: return to show stocks
                - reason: lack of change
    - cancel process
        - return to show stocks
        - return cash if it exists
    - change process
        - money >= price -> calculate change is enough
            - yes -> return change and decrease stock
            - no -> show options: cancel or accurate money to put/return money
3. Diagram

-   [Diagram Link](vending-machine.pdf)

4. Structure Design
5. Code
6. Test
7. Doc

---

---

---

# Task Description

## Task Overview

1. Diagram the mechanism of how a user obtains their desired beverage from a vending machine (format is flexible).
2. Express the main logic from (1) using a programming language of your choice (format is flexible).
    1. You can choice on Java, Kotlin, Javascript, Typescript, Clojure

### Task Details

1. Express the key logic required for the operation of the vending machine.
2. Try to account for as many cases and exceptions as possible.
3. The code should be executable.
    1. Output can be done via log printing.
    2. Framework usage is optional.
4. For diagrams, it’s okay to organize requirements and details in a separate document, but keep it under three pages.
    1. The diagram should ideally fit on one page.
5. You don’t need to spend too much time.
    1. The estimated time to complete the assignment, including both the diagram and coding, is approximately 3 hours.
    2. It is recommended to limit the total time spent on the assignment to no more than 6 hours.

### Evaluation Points

1. Documentation that is easily understandable by multiple people.
2. Consideration of possible cases and scenarios.
3. `Code` structure and its style.
    1. Whether appropriate techniques were used
    2. Whether the code is easy to read
    3. Whether the right names were used in variables, functions, files, and etc.

### Prerequisite

1. Payment methods available to the user:
    1. Cash: 100 KRW / 500 KRW / 1,000 KRW / 5,000 KRW / 10,000 KRW are accepted.
    2. Card: Card payment is possible.
2. Beverages available for purchase:
    1. Cola: 1,100 KRW
    2. Water: 600 KRW
    3. Coffee: 700 KRW
3. Need to work on the logics and processes for the possible situations

### Submission Deliverables

<aside>
💡 Submit both (1) and (2) as a link (Git) or compressed file via email.

</aside>

1. Mechanism diagram document (pdf, png, word, ppt, etc.)
2. Code output
3. `Submission format`
    1. Git repo
        1. The name of the git repository should be “{`englishname`}-vending-machine”
            1. ex) mark-vending-machine
    2. File compression
        1. The name of the compressed folder or file should be “{`englishname`}-vending-machine.zip”
            1. ex) mark-vending-machine.zip
