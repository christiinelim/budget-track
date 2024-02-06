async function main(){

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

    let data = await loadData();

    renderTransactionList(data);

    // small navbar add transaction
    document.querySelector("#add-transaction-button-nav-small").addEventListener("click", function(){
        displayTransaction();
        document.querySelector("#navbar-small").style.height = "50px";
        document.querySelector("#dropdown-small").style.display = "none";
        document.querySelector(".bi").classList.remove("bi-box-arrow-right");
        document.querySelector(".bi").classList.add("bi-list");
    });

    // navbar add transaction
    document.querySelector("#add-transaction-button-nav").addEventListener("click", function(){
        displayTransaction();
    })

    // add transaction button
    document.querySelector("#add-transaction-button").addEventListener("click", function(){
        displayTransaction();
    });

    // form cancel button
    document.querySelector("#cancel-button").addEventListener("click", function(){
        document.querySelector("#transaction-form-container").style.display = "none";
    })

    // add transaction submit form button
    document.querySelector("#submit-button").addEventListener("click", async function(){
        const validated = await formValidation();

        if (validated){
            await createTransaction(data);
            // await saveData(data);
            await renderTransactionList(data);
            document.querySelector("#transaction-form-container").style.display = "none";
            document.querySelector("#transaction-form").reset();
        } else {
            document.querySelector("#form-validation").style.display = "flex";
            setTimeout(function(){
                document.querySelector("#form-validation").style.display = "none"
            }, 1500)
        }
    });

    // update button
    document.querySelector("#update-button").addEventListener("click", async function(){
        const validated = await formValidation();

        if (validated){
            await updateTransaction(data);
            // await saveData(data);
            renderTransactionList(data);
            document.querySelector("#transaction-form-container").style.display = "none";
            document.querySelector("#transaction-form").reset();
        } else {
            document.querySelector("#form-validation").style.display = "flex";
            setTimeout(function(){
                document.querySelector("#form-validation").style.display = "none"
            }, 1500)
        }
    });

    // delete warning no button
    document.querySelector("#delete-no").addEventListener("click", function(){
        document.querySelector("#delete-warning").style.display = "none"; 
    })

    // delete warning yes button
    document.querySelector("#delete-yes").addEventListener("click", async function(){
        await deleteTransaction(data);
        // await saveData(data);
        renderTransactionList(data);
        document.querySelector("#delete-warning").style.display = "none"; 
    })

}



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
        };

        // check amount color
        if (element.type == "Income") {
            newDiv.querySelector("#amount").style.color = "#69A287"
            newDiv.querySelector("#amount").innerHTML = `+$${element.amount}`
        } else {
            newDiv.querySelector("#amount").style.color = "#FF5757"
        };

        // delete button
        const deleteButton = newDiv.querySelector("#delete-button");
        deleteButton.addEventListener("click", () => onDeleteButtonClick(element, data));

        // edit button
        const editButton = newDiv.querySelector("#edit-button");
        editButton.addEventListener("click", () => onEditButtonClick(element));

        divElement.appendChild(newDiv);
        index = index + 1;
    }
};

// display add transaction
function displayTransaction(){
    document.querySelector("#transaction-form-container").style.display = "flex";
    document.querySelector("#transaction-form").reset();
    document.querySelector("#add-transaction-header").innerHTML = "ADD NEW TRANSACTION";
    document.querySelector("#submit-button").style.display = "block";
    document.querySelector("#update-button").style.display = "none";
}


// edit transaction button
function onEditButtonClick(element){
    document.querySelector("#transaction-form-container").style.display = "flex";
    document.querySelector("#update-button").style.display = "block";
    document.querySelector("#submit-button").style.display = "none";
    document.querySelector("#add-transaction-header").innerHTML = "UPDATE TRANSACTION";

    document.querySelector("#data-id").innerHTML = element.id;
    document.querySelector("#type-select").value = element.type;
    document.querySelector("#category-select").value = element.category;
    document.querySelector("#date-form").value = element.date;
    document.querySelector("#description-form").value = element.description;
    document.querySelector("#amount-form").value = element.amount;
}


// delete transaction button
function onDeleteButtonClick(element){
    document.querySelector("#data-id").innerHTML = element.id;
    document.querySelector("#delete-warning").style.display = "flex"; 
}

// validate form has no empty input
function formValidation(){
    const newDate = document.querySelector("#date-form").value;
    const newDescription = document.querySelector("#description-form").value;
    const newAmount = document.querySelector("#amount-form").value;

    if (newDate != "" && newDescription != "" && newAmount != ""){
        return true
    } else {
        return false
    }
}

main();