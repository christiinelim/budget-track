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
            const newTransaction = {
                "id": Math.floor(Math.random() * 10000),
                "type": document.querySelector("#type-select").value,
                "category": document.querySelector("#category-select").value,
                "date": document.querySelector("#date-form").value,
                "description": document.querySelector("#description-form").value,
                "amount": document.querySelector("#amount-form").value
            };

            await createTransaction(data, newTransaction);
            await saveData(data);
            let sortedData = await extractRelevantData(data, null, "date", "descending");
            await renderTransactionList(sortedData);
            document.querySelector("#transaction-form-container").style.display = "none";
            document.querySelector("#transaction-form").reset();
        } else if (isNaN(Number(document.querySelector("#amount-form").value))) {
            document.querySelector("#validation-text").innerHTML = "Please enter a valid number for amount";
            document.querySelector("#form-validation").style.display = "flex";
            setTimeout(function(){
                document.querySelector("#form-validation").style.display = "none"
            }, 1500)
        } else {
            document.querySelector("#validation-text").innerHTML = "Please fill up all the fields";
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
            const newType = document.querySelector("#type-select").value;
            const newCategory = document.querySelector("#category-select").value;
            const newDate = document.querySelector("#date-form").value;
            const newDescription = document.querySelector("#description-form").value;
            const newAmount = document.querySelector("#amount-form").value;
            await updateTransaction(data, newType, newCategory, newDate, newDescription, newAmount);
            await saveData(data);
            let sortedData = await extractRelevantData(data, null, "date", "descending");
            await renderTransactionList(sortedData);
            document.querySelector("#transaction-form-container").style.display = "none";
            document.querySelector("#transaction-form").reset();

            // reset filter and sort options
            document.querySelector("#filter-box-select").selectedIndex = 0;
            document.querySelector("#sort-by-select").selectedIndex = 0;
        } else if (isNaN(Number(document.querySelector("#amount-form").value))) {
            document.querySelector("#validation-text").innerHTML = "Please enter a valid number for amount";
            document.querySelector("#form-validation").style.display = "flex";
            setTimeout(function(){
                document.querySelector("#form-validation").style.display = "none"
            }, 1500)
        } else {
            document.querySelector("#validation-text").innerHTML = "Please fill up all the fields";
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
        document.querySelector("#filter-box-select").selectedIndex = 0;
        document.querySelector("#sort-by-select").selectedIndex = 0;
        await saveData(data);
        renderTransactionList(data);
        document.querySelector("#delete-warning").style.display = "none"; 
    })


    // filter
    document.querySelector("#filter-box-select").addEventListener("change", async function(){
        if (document.querySelector("#filter-box-select").value == "show-all"){
            // need the different scenarios
            if (document.querySelector("#sort-by-select").value == "date-descending"){
                let sortedData = await extractRelevantData(data, null, "date", "descending");
                renderTransactionList(sortedData);
            } else if (document.querySelector("#sort-by-select").value == "date-ascending"){
                let sortedData = await extractRelevantData(data, null, "date", "ascending");
                renderTransactionList(sortedData);
            } else if (document.querySelector("#sort-by-select").value == "amount-descending"){
                let sortedData = await extractRelevantData(data, null, "amount", "descending");
                renderTransactionList(sortedData);
            } else {
                let sortedData = await extractRelevantData(data, null, "amount", "ascending");
                renderTransactionList(sortedData);
            }     
        } else if (document.querySelector("#filter-box-select").value == "current-month"){
            let extractedData = await extractRelevantData(data, getCurrentMonth(), "month", "descending");
            if (document.querySelector("#sort-by-select").value == "date-descending"){
                let sortedData = await extractRelevantData(extractedData, null, "date", "descending");
                renderTransactionList(sortedData);
            } else if (document.querySelector("#sort-by-select").value == "date-ascending"){
                let sortedData = await extractRelevantData(extractedData, null, "date", "ascending");
                renderTransactionList(sortedData);
            } else if (document.querySelector("#sort-by-select").value == "amount-descending"){
                let sortedData = await extractRelevantData(extractedData, null, "amount", "descending");
                renderTransactionList(sortedData);
            } else {
                let sortedData = await extractRelevantData(extractedData, null, "amount", "ascending");
                renderTransactionList(sortedData);
            }  
        } else {
            let extractedData = await extractRelevantData(data, getPreviousMonth(getCurrentMonth()), "month", "descending");
            if (document.querySelector("#sort-by-select").value == "date-descending"){
                let sortedData = await extractRelevantData(extractedData, null, "date", "descending");
                renderTransactionList(sortedData);
            } else if (document.querySelector("#sort-by-select").value == "date-ascending"){
                let sortedData = await extractRelevantData(extractedData, null, "date", "ascending");
                renderTransactionList(sortedData);
            } else if (document.querySelector("#sort-by-select").value == "amount-descending"){
                let sortedData = await extractRelevantData(extractedData, null, "amount", "descending");
                renderTransactionList(sortedData);
            } else {
                let sortedData = await extractRelevantData(extractedData, null, "amount", "ascending");
                renderTransactionList(sortedData);
            } 
        }
    })

    // sort
    document.querySelector("#sort-by-select").addEventListener("change", async function(){
        if (document.querySelector("#sort-by-select").value == "date-descending") {
            if (document.querySelector("#filter-box-select").value == "show-all"){
                let sortedData = await extractRelevantData(data, null, "date", "descending");
                renderTransactionList(sortedData)
            } else if (document.querySelector("#filter-box-select").value == "current-month") {
                let extractedData = await extractRelevantData(data, getCurrentMonth(), "month", "descending");
                renderTransactionList(extractedData)
            } else {
                let extractedData = await extractRelevantData(data, getPreviousMonth(getCurrentMonth()), "month", "descending");
                renderTransactionList(extractedData)
            }
        } else if (document.querySelector("#sort-by-select").value == "date-ascending") {
            if (document.querySelector("#filter-box-select").value == "show-all"){
                let sortedData = await extractRelevantData(data, null, "date", "ascending");
                renderTransactionList(sortedData)
            } else if (document.querySelector("#filter-box-select").value == "current-month") {
                let extractedData = await extractRelevantData(data, getCurrentMonth(), "month", "descending");
                let sortedData = await extractRelevantData(extractedData, null, "date", "ascending");
                renderTransactionList(sortedData)
            } else {
                let extractedData = await extractRelevantData(data, getPreviousMonth(getCurrentMonth()), "month", "descending");
                let sortedData = await extractRelevantData(extractedData, null, "date", "ascending");
                renderTransactionList(sortedData)
            }
        } else if (document.querySelector("#sort-by-select").value == "amount-ascending"){
            if (document.querySelector("#filter-box-select").value == "show-all"){
                let sortedData = await extractRelevantData(data, null, "amount", "ascending");
                renderTransactionList(sortedData)
            } else if (document.querySelector("#filter-box-select").value == "current-month") {
                let extractedData = await extractRelevantData(data, getCurrentMonth(), "month", "descending");
                let sortedData = await extractRelevantData(extractedData, null, "amount", "ascending");
                renderTransactionList(sortedData)
            } else {
                let extractedData = await extractRelevantData(data, getPreviousMonth(getCurrentMonth()), "month", "descending");
                let sortedData = await extractRelevantData(extractedData, null, "amount", "ascending");
                renderTransactionList(sortedData)
            }
        } else {
            if (document.querySelector("#filter-box-select").value == "show-all"){
                let sortedData = await extractRelevantData(data, null, "amount", "descending");
                renderTransactionList(sortedData)
            } else if (document.querySelector("#filter-box-select").value == "current-month") {
                let extractedData = await extractRelevantData(data, getCurrentMonth(), "month", "descending");
                let sortedData = await extractRelevantData(extractedData, null, "amount", "descending");
                renderTransactionList(sortedData)
            } else {
                let extractedData = await extractRelevantData(data, getPreviousMonth(getCurrentMonth()), "month", "descending");
                let sortedData = await extractRelevantData(extractedData, null, "amount", "descending");
                renderTransactionList(sortedData)
            }
        }
    })
}

// render transaction data
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
        // check decimal point of amount
        let amount = element.amount;
        amount = checkDecimal(amount);

        const newDiv = document.createElement("div");
        newDiv.setAttribute("id", "transaction-list-render");
        newDiv.classList.add("row");
        newDiv.innerHTML = `
            <div id="category" class="col-2">${element.category}</div>
            <div id="date" class="col-3">${element.date}</div>
            <div id="description" class="col-4">${element.description}</div>
            <div id="amount" class="col-2">-$${amount}</div>
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
            newDiv.querySelector("#amount").innerHTML = `+$${amount}`
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
        if (isNaN(Number(newAmount))) {
            return false
        } else {
            return true
        }
    } else {
        return false
    }
}

main();