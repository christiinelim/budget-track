// JSON bin
// const BIN_ID = "65c20ce4266cfc3fde867e5d";
// const BASE_JSON_BIN_URL = "https://api.jsonbin.io/v3/b";
// const MASTER_KEY = "$2a$10$LLQ1eADf.I2lO1q9VTvKSeHEEGrQ58G42eMJTdjJgEe2CkrMl1mMa";

// async function loadData() {
//     const response = await axios.get(`${BASE_JSON_BIN_URL}/${BIN_ID}/latest`);
//     const data = response.data
        // data.sort((b, a) => new Date(a.date) - new Date(b.date));
        // return data
// };

async function loadData() {
    const response = await axios.get("data.json");
    const data = response.data
    data.sort((b, a) => new Date(a.date) - new Date(b.date));
    return data
};

// auto save data
// async function saveData(data) {
//     const response = await axios.put(`${BASE_JSON_BIN_URL}/${BIN_ID}`, data, {
//         'Content-Type': "application/json", 
//         'X-Master-Key': MASTER_KEY,
//     });

//     return response.data.record
// }


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
function getPreviousMonth(){
    const today = new Date();
    today.setDate(1);
    today.setDate(0);
    const year = today.getFullYear();
    let month = today.getMonth() + 1; 
    month = month < 10 ? '0' + month : month;
    const previousMonth = year + '-' + month;

    return previousMonth
}

function getCurrentMonth(){
    const currentMonth = new Date().toJSON().slice(0, 7);

    return currentMonth
}

function extractData(data, month){
    const extractedData = [];
    for (let element of data){
        if (element.date.slice(0,7) == month){
            extractedData.push(element)
        }
    }
    return extractedData
}

function loadDashboard(data){
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