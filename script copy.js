// JSON bin
const BIN_ID = "65c0e5fcdc74654018a0931d";
const BASE_JSON_BIN_URL = "https://api.jsonbin.io/v3/b";
const MASTER_KEY = "$2a$10$LLQ1eADf.I2lO1q9VTvKSeHEEGrQ58G42eMJTdjJgEe2CkrMl1mMa";

// menu button
document.querySelector("#menu-button-click").addEventListener("click", () => {
    if (document.querySelector(".bi-list")){
        document.querySelector("#navbar-small").style.height = "100vh";
        document.querySelector("#dropdown-small").style.display = "flex";
        document.querySelector(".bi").classList.remove("bi-list");
        document.querySelector(".bi").classList.add("bi-box-arrow-right");
    } else {
        document.querySelector("#navbar-small").style.height = "50px";
        document.querySelector("#dropdown-small").style.display = "none";
        document.querySelector(".bi").classList.remove("bi-box-arrow-right");
        document.querySelector(".bi").classList.add("bi-list");
    }
});

document.querySelector(".dropdown-option-small").addEventListener("click", () => {
    document.querySelector("#navbar-small").style.height = "50px";
    document.querySelector("#dropdown-small").style.display = "none";
    document.querySelector(".bi").classList.remove("bi-box-arrow-right");
    document.querySelector(".bi").classList.add("bi-list");
})


// fetch data main function
document.addEventListener("DOMContentLoaded", async function(){

    const data = await loadData();
    
    renderTransactionList(data);

    // add transaction nav
    document.querySelector("#add-transaction-button-nav").addEventListener("click", function(){
        onAddTransactionClick()
    });

    document.querySelector("#add-transaction-button-nav-small").addEventListener("click", function(){
        onAddTransactionClick();
        document.querySelector("#navbar-small").style.height = "50px";
        document.querySelector("#dropdown-small").style.display = "none";
        document.querySelector(".bi").classList.remove("bi-box-arrow-right");
        document.querySelector(".bi").classList.add("bi-list");
    });
    
    // add transaction button
    document.querySelector("#add-transaction-button").addEventListener("click", function(){
        onAddTransactionClick()
    });

    // transaction form submit button
    document.querySelector("#submit-button").addEventListener("click", async function(){
        createTransaction(data);
        await saveData(data);
        renderTransactionList(data);
    });

    document.querySelector("#cancel-button").addEventListener("click", function(){
        document.querySelector("#transaction-form-container").style.display = "none";
    })


    // delete no click
    document.querySelector("#delete-no").addEventListener("click", function(){
        document.querySelector("#delete-warning").style.display = "none"; 
    })

});

// load json data
async function loadData(){
    const response = await axios.get(`${BASE_JSON_BIN_URL}/${BIN_ID}/latest`);
    return response.data.record;
}

// auto save data
async function saveData(data) {
    const response = await axios.put(`${BASE_JSON_BIN_URL}/${BIN_ID}`, data, {
        'Content-Type': "application/json", 
        'X-Master-Key': MASTER_KEY,
    });

    return response.data.record
}

// render list
function renderTransactionList(data){
    const divElement = document.querySelector("#transaction-list");
    divElement.innerHTML = `
        <div id="transaction-list-header" class="row">
            <div id="category" class="col-2">
                Category
            </div>
            <div id="date" class="col-3">
                Date
            </div>
            <div id="description" class="col-4">
                Description
            </div>
            <div id="amount" class="col-2">
                Amount
            </div>
            <div id="action" class="col-1">
                Action
            </div>
        </div>
    `

    let index = 0;
    for (let element of data){
        const newDiv = document.createElement("div");
        newDiv.setAttribute("id", "transaction-list-render")
        newDiv.classList.add("row");
        newDiv.innerHTML = `
            <div id="category" class="col-2">${element.category}</div>
            <div id="date" class="col-3">${element.date}</div>
            <div id="description" class="col-4">${element.description}</div>
            <div id="amount" class="col-2">-$${element.amount}</div>
            <div id="render-action" class="col-1">
                <div id="trash"><button id="delete-button"><i id="render-icon" class="bi bi-trash-fill"></i></button></div>
                <div id="edit"><button id="edit-button"><a href="#transaction-form-container"><i id="render-icon" class="bi bi-pencil-fill"></i></a></button></div>
            </div>
        `;

        
        // check background color
        if (index % 2 == 0){
            newDiv.style.backgroundColor = "#E2E7F1"
        }

        // check amount color
        if (element.type == "Income") {
            newDiv.querySelector("#amount").style.color = "#69A287"
            newDiv.querySelector("#amount").innerHTML = `+$${element.amount}`
        } else {
            newDiv.querySelector("#amount").style.color = "#FF5757"
        }

        divElement.appendChild(newDiv);
        index = index + 1;
    }

    // edit button 
    const editButtonArray = document.querySelectorAll("#edit-button");

    for (let i = 0; i < editButtonArray.length; i++){
        editButtonArray[i].addEventListener("click", function(){
            onUpdateTransactionClick(data, i);
        });
    }

    // delete button
    const deleteButtonArray = document.querySelectorAll("#delete-button");

    for (let i = 0; i < deleteButtonArray.length; i++){
        deleteButtonArray[i].addEventListener("click", async function(){
            onDeleteButtonClick(data, i)
        });
    }
};

// add transaction display
function onAddTransactionClick(){
    document.querySelector("#transaction-form-container").style.display = "flex";
    document.querySelector("#transaction-form").reset();
    document.querySelector("#add-transaction-header").innerHTML = "ADD NEW TRANSACTION";
    document.querySelector("#submit-button").style.display = "block";
    document.querySelector("#update-button").style.display = "none";
}

// add transactions
function createTransaction(data){
    const newTransaction = {
        "type": document.querySelector("#type-select").value,
        "category": document.querySelector("#category-select").value,
        "date": document.querySelector("#date-form").value,
        "description": document.querySelector("#description-form").value,
        "amount": parseFloat(document.querySelector("#amount-form").value)
    };
    data.push(newTransaction)
    document.querySelector("#transaction-form-container").style.display = "none";
    document.querySelector("#transaction-form").reset();
};


// update transaction form
function onUpdateTransactionClick(data, editButtonIndex){
    document.querySelector("#transaction-form-container").style.display = "flex";
    document.querySelector("#update-button").style.display = "block";
    document.querySelector("#submit-button").style.display = "none";
    document.querySelector("#add-transaction-header").innerHTML = "UPDATE TRANSACTION";
    
    document.querySelector("#type-select").value = data[editButtonIndex].type;
    document.querySelector("#category-select").value = data[editButtonIndex].category;
    document.querySelector("#date-form").value = data[editButtonIndex].date;
    document.querySelector("#description-form").value = data[editButtonIndex].description;
    document.querySelector("#amount-form").value = data[editButtonIndex].amount;

    console.log(editButtonIndex)

    document.querySelector("#update-button").addEventListener("click", async function(){
        const type = document.querySelector("#type-select").value;
        const category = document.querySelector("#category-select").value;
        const date = document.querySelector("#date-form").value;
        const description = document.querySelector("#description-form").value;
        const amount = document.querySelector("#amount-form").value;
        console.log(editButtonIndex)
        await updateTransaction(data, editButtonIndex, type, category, date, description, amount);
        document.querySelector("#transaction-form-container").style.display = "none";
        document.querySelector("#transaction-form").reset();
    })
}

// update transaction
async function updateTransaction(data, editButtonIndex, type, category, date, description, amount){
    data[editButtonIndex].type = type;
    data[editButtonIndex].category = category;
    data[editButtonIndex].date = date;
    data[editButtonIndex].description = description;
    data[editButtonIndex].amount = amount;

    await saveData(data);
    renderTransactionList(data)
}

// delete transaction warning
function onDeleteButtonClick(data, deleteButtonIndex){
    document.querySelector("#delete-warning").style.display = "flex"; 

    document.querySelector("#delete-yes").addEventListener("click", async function(){
        console.log(deleteButtonIndex);
        // await deleteTransaction(data, deleteButtonIndex);
        document.querySelector("#delete-warning").style.display = "none"
    })
}


// delete transaction
function deleteTransaction(data, deleteButtonIndex){
    // data.splice(deleteButtonIndex, 1);
    // // await saveData(data);
    // renderTransactionList(data);
}