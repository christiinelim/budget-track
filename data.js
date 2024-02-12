// JSON bin
const BIN_ID = "65c9c501dc74654018a39987";
const BASE_JSON_BIN_URL = "https://api.jsonbin.io/v3/b";
const MASTER_KEY = "$2a$10$LLQ1eADf.I2lO1q9VTvKSeHEEGrQ58G42eMJTdjJgEe2CkrMl1mMa";

async function loadData() {
    const response = await axios.get(`${BASE_JSON_BIN_URL}/${BIN_ID}/latest`);
    const data = response.data.record
    data.sort((b, a) => new Date(a.date) - new Date(b.date));
    return data
};

// async function loadData() {
//     const response = await axios.get("data.json");
//     const data = response.data
//     data.sort((b, a) => new Date(a.date) - new Date(b.date));
//     return data
// };

// auto save data
async function saveData(data) {
    const response = await axios.put(`${BASE_JSON_BIN_URL}/${BIN_ID}`, data, {
        'Content-Type': "application/json", 
        'X-Master-Key': MASTER_KEY,
    });

    return response.data.record
}


function createTransaction(data, newTransaction){
    data.push(newTransaction)
};

function updateTransaction(data, newType, newCategory, newDate, newDescription, newAmount){

    for (let element of data){
        if (element.id == Number(document.querySelector("#data-id").innerHTML)){
            element.type = newType;
            element.category = newCategory;
            element.date = newDate;
            element.description = newDescription;
            element.amount = newAmount
            break
        }
    }
};

function deleteTransaction(data){
    index = 0
    for (let element of data){
        if (element.id == Number(document.querySelector("#data-id").innerHTML)){
            data.splice(index, 1);
            break
        }
        index = index + 1
    }
}



// FOR DASHBOARD
function getPreviousMonth(inputDate){
    const [year, month] = inputDate.split('-').map(Number);
    
    let prevMonth = month - 1;
    let prevYear = year;

    if (prevMonth === 0) {
        prevMonth = 12; 
        prevYear--; 
    }

    const formattedPrevMonth = `${prevYear}-${prevMonth.toString().padStart(2, '0')}`;

    return formattedPrevMonth;
}

function getCurrentMonth(){
    const currentMonth = new Date().toJSON().slice(0, 7);

    return currentMonth
}

function extractRelevantData(data, comparator, type, direction){
    let extractedData = [];
    if (type == "month"){
        for (let element of data){
            if (element.date.slice(0,7) == comparator){
                extractedData.push(element)
            }
        }
        return extractedData
    } else if (type == "amount"){
        extractedData = data;
        // check direction
        if (direction == "descending"){
            extractedData.sort((b, a) => a.amount - b.amount);
        } else {
            extractedData.sort((a, b) => a.amount - b.amount);
        }
        return extractedData
    } else { // by date
        extractedData = data;
        // check direction
        if (direction == "descending"){
            extractedData.sort((b, a) => new Date(a.date) - new Date(b.date));
        } else {
            console.log("hello")
            extractedData.sort((a, b) => new Date(a.date) - new Date(b.date));
        }
        return extractedData
    }
}

async function loadDashboard(data){
    let currentExpenditure = 0;
    let currentIncome = 0;
    let shoppingTransactions = 0;
    let foodTransactions = 0;
    let transportTransactions = 0;
    let billTransactions = 0;

    for (let element of data) {
        if (element.type == "Income"){
            currentIncome = currentIncome + element.amount;
        } else {
            if (element.category == "Shopping"){
                shoppingTransactions = shoppingTransactions + 1;
            } else if (element.category == "Food"){
                foodTransactions = foodTransactions + 1;
            } else if (element.category == "Transport"){
                transportTransactions = transportTransactions + 1;
            } else {
                billTransactions = billTransactions + 1
            }
            currentExpenditure = currentExpenditure + element.amount;
        }
    }

    // check decimal point of expenditure and income

   currentExpenditure = await checkDecimal(currentExpenditure);
   currentIncome = await checkDecimal(currentIncome);

    const dashboardData = {
        "currentExpenditure": currentExpenditure,
        "currentIncome": currentIncome,
        "shoppingTransactions": shoppingTransactions,
        "foodTransactions": foodTransactions,
        "transportTransactions": transportTransactions,
        "billTransactions": billTransactions,
    }
    
    return dashboardData
};


function checkDecimal(value){
    if (value.toString().includes(".")) {
        return parseFloat(value).toFixed(2)
    } else {
        return parseInt(value)
    }
}


async function organizeData(data){
    const dataSet = {
        "dataAxis": ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"],
        "expenditureData": [],
        "incomeData": [],
        "spendingsData": {
            "total": [],
            "shopping": [],
            "food": [],
            "transport": [],
            "bill": []
        }
    }

    let currentMonthAndYear = getCurrentMonth(); // get 2024-02
    let currentYear = currentMonthAndYear.slice(0,4); // get 2024
    let expenditure = 0;
    let income = 0;
    let shopping = 0;
    let food = 0;
    let transport = 0;
    let bill = 0;

    for (let element of data){
        // check if it is current year data
        if (element.date.slice(0,4) == currentYear){
            if (element.date.slice(0,7) == currentMonthAndYear){
                if (element.type == "Income"){
                    income = income + element.amount;
                } else {
                    expenditure = expenditure + element.amount;
                    if (element.category == "Shopping") {
                        shopping = shopping + element.amount
                    } else if (element.category == "Food") {
                        food = food + element.amount
                    } else if (element.category == "Transport") {
                        transport = transport + element.amount
                    } else {
                        bill = bill + element.amount
                    }
                }
            } else {
                // push expenditureData 
                dataSet.expenditureData.unshift(checkDecimal(expenditure));
                dataSet.incomeData.unshift(checkDecimal(income));
                dataSet.spendingsData.total.unshift(checkDecimal(expenditure));
                dataSet.spendingsData.shopping.unshift(checkDecimal(shopping));
                dataSet.spendingsData.food.unshift(checkDecimal(food));
                dataSet.spendingsData.transport.unshift(checkDecimal(transport));
                dataSet.spendingsData.bill.unshift(checkDecimal(bill));

                // reinitialize
                currentMonthAndYear = getPreviousMonth(getCurrentMonth());
                expenditure = 0;
                income = 0;
                shopping = 0;
                food = 0;
                transport = 0;
                bill = 0;

                if (element.type == "Income"){
                    income = income + element.amount;
                } else {
                    expenditure = expenditure + element.amount;
                    if (element.category == "Shopping") {
                        shopping = shopping + element.amount
                    } else if (element.category == "Food") {
                        food = food + element.amount
                    } else if (element.category == "Transport") {
                        transport = transport + element.amount
                    } else {
                        bill = bill + element.amount
                    }
                }
            }
        } else {
            // push expenditureData 
            dataSet.expenditureData.unshift(checkDecimal(expenditure));
            dataSet.incomeData.unshift(checkDecimal(income));
            dataSet.spendingsData.total.unshift(checkDecimal(expenditure));
            dataSet.spendingsData.shopping.unshift(checkDecimal(shopping));
            dataSet.spendingsData.food.unshift(checkDecimal(food));
            dataSet.spendingsData.transport.unshift(checkDecimal(transport));
            dataSet.spendingsData.bill.unshift(checkDecimal(bill));
            break
        }
    }

    return dataSet
}