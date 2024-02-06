// JSON bin
// const BIN_ID = "65c20ce4266cfc3fde867e5d";
// const BASE_JSON_BIN_URL = "https://api.jsonbin.io/v3/b";
// const MASTER_KEY = "$2a$10$LLQ1eADf.I2lO1q9VTvKSeHEEGrQ58G42eMJTdjJgEe2CkrMl1mMa";

// async function loadData() {
//     const response = await axios.get(`${BASE_JSON_BIN_URL}/${BIN_ID}/latest`);
//     return response.data.record
// };

async function loadData() {
    const response = await axios.get("data.json");
    return response.data
};

// auto save data
// async function saveData(data) {
//     const response = await axios.put(`${BASE_JSON_BIN_URL}/${BIN_ID}`, data, {
//         'Content-Type': "application/json", 
//         'X-Master-Key': MASTER_KEY,
//     });

//     return response.data.record
// }

function createTransaction(data){
    const newTransaction = {
        "id": Math.floor(Math.random() * 10000),
        "type": document.querySelector("#type-select").value,
        "category": document.querySelector("#category-select").value,
        "date": document.querySelector("#date-form").value,
        "description": document.querySelector("#description-form").value,
        "amount": parseFloat(document.querySelector("#amount-form").value)
    };
    data.push(newTransaction)
};

function updateTransaction(data){
    const newType = document.querySelector("#type-select").value;
    const newCategory = document.querySelector("#category-select").value;
    const newDate = document.querySelector("#date-form").value;
    const newDescription = document.querySelector("#description-form").value;
    const newAmount = document.querySelector("#amount-form").value;

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