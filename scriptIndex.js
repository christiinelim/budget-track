async function main(){
    let data = await loadData();

    // extract previous month data
    let extractPreviousMonthData = await extractData(data, getPreviousMonth());
    let previousMonthData = await loadDashboard(extractPreviousMonthData);

    // extract current month data
    let extractedData = await extractData(data, getCurrentMonth());
    let dashboardData = await loadDashboard(extractedData);

    // calculate the percentage changes from previous month
    await compareTransactions(previousMonthData, dashboardData);

    let relevantShoppingData = await filterRelevant(extractedData, "Shopping");
    let relevantFoodData = await filterRelevant(extractedData, "Food");
    let relevantTransportData = await filterRelevant(extractedData, "Transport");
    let relevantBillData = await filterRelevant(extractedData, "Bill");

    await updateDashboard(dashboardData);

    document.querySelector("#breakdown-exit").addEventListener("click", function(){
        document.querySelector("#breakdown-container").style.display = "none";
        document.querySelector("#transaction-list").style.display = "none";
    })

    // select shopping button
    document.querySelector("#summary-shopping").addEventListener("click", async function(){
        // to filter array for shopping
        await renderListHeader("Shopping Breakdown");
        document.querySelector("#transaction-list").style.display = "block";
        // render list
        await renderBreakdownList(relevantShoppingData);
    });

    // select food button
    document.querySelector("#summary-food").addEventListener("click", async function(){
        await renderListHeader("Food Breakdown");
        document.querySelector("#transaction-list").style.display = "block";
        // render list
        await renderBreakdownList(relevantFoodData);
    })

    // select transport button
    document.querySelector("#summary-transport").addEventListener("click", async function(){
        await renderListHeader("Transport Breakdown");
        document.querySelector("#transaction-list").style.display = "block";
        // render list
        await renderBreakdownList(relevantTransportData);
    })

    // select bill button
    document.querySelector("#summary-bill").addEventListener("click", async function(){
        await renderListHeader("Bill Breakdown");
        document.querySelector("#transaction-list").style.display = "block";
        // render list
        await renderBreakdownList(relevantBillData);
    })


    // TRANSACTION FORM
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
                "amount": parseFloat(document.querySelector("#amount-form").value)
            };

            await createTransaction(data, newTransaction);
            // await saveData(data); // CHECK TO MAKE SURE DATA OF DASHBOARD UPDATED
            document.querySelector("#transaction-form-container").style.display = "none";
            document.querySelector("#transaction-form").reset();
        } else {
            document.querySelector("#form-validation").style.display = "flex";
            setTimeout(function(){
                document.querySelector("#form-validation").style.display = "none"
            }, 1500)
        }
    });
};

// render breakdown
function renderBreakdownList(data){
    const divElement = document.querySelector("#transaction-list");
    divElement.innerHTML = `
        <div id="transaction-list-header" class="row">
            <div id="category" class="col-2">
                Category
            </div>
            <div id="date" class="col-3">
                Date
            </div>
            <div id="description" class="col-5">
                Description
            </div>
            <div id="amount" class="col-2">
                Amount
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
            <div id="description" class="col-5">${element.description}</div>
            <div id="amount" class="col-2">-$${element.amount}</div>
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

        divElement.appendChild(newDiv);
        index = index + 1;
    }
};

function updateDashboard(dashboardData){
    
    // check balance 
    if (dashboardData.currentIncome > dashboardData.currentExpenditure){
        document.querySelector("#balance-amount").innerHTML = `$${dashboardData.currentIncome - dashboardData.currentExpenditure}`;
    } else {
        document.querySelector("#balance-amount").innerHTML = `-$${dashboardData.currentExpenditure - dashboardData.currentIncome}`;
        document.querySelector("#balance-amount").style.color = "rgb(255, 87, 87)";
    }

    // display expenditure and income amount
    document.querySelector("#expenditure-amount").innerHTML = `$${dashboardData.currentExpenditure}`;
    document.querySelector("#income-amount").innerHTML = `$${dashboardData.currentIncome}`;

    // get spending transactions
    document.querySelector("#shopping-transactions").innerHTML = `${dashboardData.shoppingTransactions} transactions`;
    document.querySelector("#food-transactions").innerHTML = `${dashboardData.foodTransactions} transactions`;
    document.querySelector("#transport-transactions").innerHTML = `${dashboardData.transportTransactions} transactions`;
    document.querySelector("#bill-transactions").innerHTML = `${dashboardData.billTransactions} transactions`;
};

function filterRelevant(data, searchTerm){
    let filteredData = [];
    for (let element of data){
        if (element.category == searchTerm){
            filteredData.push(element)
        }
    }
    return filteredData
}

function renderListHeader(header){
    document.querySelector("#breakdown-container").style.display = "flex";
    document.querySelector("#relevant-title").innerHTML = header;
    document.querySelector("#breakdown-exit").innerHTML = `<i class="bi bi-x-circle"></i>`;
}

// display add transaction
function displayTransaction(){
    document.querySelector("#transaction-form-container").style.display = "flex";
    document.querySelector("#transaction-form").reset();
    document.querySelector("#add-transaction-header").innerHTML = "ADD NEW TRANSACTION";
    document.querySelector("#submit-button").style.display = "block";
    document.querySelector("#update-button").style.display = "none";
}

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


// compare the percentage changes in spending and income
function compareTransactions(previousMonthData, currentMonthData){
    const previousMonthBalance = previousMonthData.currentIncome - previousMonthData.currentExpenditure;
    const currentMonthBalance = currentMonthData.currentIncome - currentMonthData.currentExpenditure;

    const balanceChange = Math.floor((currentMonthBalance - previousMonthBalance) / previousMonthBalance * 100);
    const expenditureChange = Math.floor((currentMonthData.currentExpenditure - previousMonthData.currentExpenditure) / previousMonthData.currentExpenditure * 100);
    const incomeChange = Math.floor((currentMonthData.currentIncome - previousMonthData.currentIncome) / previousMonthData.currentIncome * 100);

    console.log(balanceChange);
    console.log(expenditureChange);

    console.log(incomeChange);

    if (balanceChange == Infinity) {
        document.querySelector("#balance-compare-icon").innerHTML = `<i class="bi bi-dash-circle-fill"></i>`;
        document.querySelector("#balance-compare-result").innerHTML = `0%`;
    } else if (balanceChange > 0){
        document.querySelector("#balance-compare-icon").innerHTML = `<i class="bi bi-arrow-up-right-circle-fill"></i>`;
        document.querySelector("#balance-compare-icon").style.color = "#69A287"
        document.querySelector("#balance-compare-result").innerHTML = `${balanceChange}%`;
        document.querySelector("#balance-compare-result").style.color = "#69A287";
    } else {
        document.querySelector("#balance-compare-icon").innerHTML = `<i class="bi bi-arrow-down-left-circle-fill"></i>`;
        document.querySelector("#balance-compare-icon").style.color = "rgb(255, 87, 87)"
        document.querySelector("#balance-compare-result").innerHTML = `${balanceChange}%`;
        document.querySelector("#balance-compare-result").style.color = "rgb(255, 87, 87)";
    }

    if (expenditureChange == Infinity) {
        document.querySelector("#expenditure-compare-icon").innerHTML = `<i class="bi bi-dash-circle-fill"></i>`;
        document.querySelector("#expenditure-compare-result").innerHTML = `0%`;
    } else if (expenditureChange > 0){
        document.querySelector("#expenditure-compare-icon").innerHTML = `<i class="bi bi-arrow-up-right-circle-fill"></i>`;
        document.querySelector("#expenditure-compare-icon").style.color = "#69A287"
        document.querySelector("#expenditure-compare-result").innerHTML = `${expenditureChange}%`;
        document.querySelector("#expenditure-compare-result").style.color = "#69A287";
    } else {
        document.querySelector("#expenditure-compare-icon").innerHTML = `<i class="bi bi-arrow-down-left-circle-fill"></i>`;
        document.querySelector("#expenditure-compare-icon").style.color = "rgb(255, 87, 87)"
        document.querySelector("#expenditure-compare-result").innerHTML = `${expenditureChange}%`;
        document.querySelector("#expenditure-compare-result").style.color = "rgb(255, 87, 87)";
    }

    if (incomeChange == Infinity) {
        document.querySelector("#income-compare-icon").innerHTML = `<i class="bi bi-dash-circle-fill"></i>`;
        document.querySelector("#income-compare-result").innerHTML = `0%`;
    } else if (incomeChange > 0){
        document.querySelector("#income-compare-icon").innerHTML = `<i class="bi bi-arrow-up-right-circle-fill"></i>`;
        document.querySelector("#income-compare-icon").style.color = "#69A287"
        document.querySelector("#income-compare-result").innerHTML = `${incomeChange}%`;
        document.querySelector("#income-compare-result").style.color = "#69A287";
    } else {
        document.querySelector("#income-compare-icon").innerHTML = `<i class="bi bi-arrow-down-left-circle-fill"></i>`;
        document.querySelector("#income-compare-icon").style.color = "rgb(255, 87, 87)"
        document.querySelector("#income-compare-result").innerHTML = `${incomeChange}%`;
        document.querySelector("#income-compare-result").style.color = "rgb(255, 87, 87)";
    }

}

main();