const dropList = document.querySelectorAll("form select");
const fromCurrency = document.querySelector(".from select");
const toCurrency = document.querySelector(".to select");
const getButton = document.querySelector("form button");

for (let i = 0; i < dropList.length; i++) {
    // loop through each currency in country_list
    for (let currency_code in country_list) {
        // first dropdown, USD by default - second dropdown, JM by default
        let selected = i == 0 ? currency_code == "USD" : currency_code == "AED";
        let optionTag = `<option value="${currency_code}" ${selected ? 'selected' : ''}>${currency_code}</option>`;
        dropList[i].insertAdjacentHTML("beforeend", optionTag);
    }

    // event listener for flag changes
    dropList[i].addEventListener("change", (flag) => {
        loadFlag(flag.target);
    });
}

// function to load flag image based on the currency selected
function loadFlag(element) {
    for (let code in country_list) {
        if (code === element.value) {
            let imageTag = element.parentElement.querySelector("img");
            imageTag.src = `https://flagcdn.com/48x36/${country_list[code].toLowerCase()}.png`;
        }
    }
}

// wait til the page loads, then get exchange rate
window.addEventListener("load", () => {
    getExchangeRate();
});

// event listener to get exchange rate when button clicked
getButton.addEventListener("click", () => {
    getExchangeRate();
});

// swap currencies when icon clicked
const exchangeIcon = document.querySelector("form .icon");
exchangeIcon.addEventListener("click", () => {
    let tempCode = fromCurrency.value;
    fromCurrency.value = toCurrency.value;
    toCurrency.value = tempCode;
    loadFlag(fromCurrency);
    loadFlag(toCurrency);
    getExchangeRate();
});

// function to fetch and display exchange rate
function getExchangeRate() {
    const amount = document.querySelector("form input");
    const exchangeRateTxt = document.querySelector("form .exchange-rate");
    let amountValue = amount.value;

    // if amount empty or zero, set to 1 by default
    if (amountValue === "" || amountValue === "0") {
        amount.value = "1";
        amountValue = 1;
    }

    exchangeRateTxt.innerText = "Loading...";

    // fetch the exchange rate from API
    let apiKey = `b5f89dbac5cd0a83d3e70e91`;
    let apiUrl = `https://v6.exchangerate-api.com/v6/${apiKey}/latest/${fromCurrency.value}`;
    fetch(apiUrl)
        .then((response) => response.json())
        .then((result) => {
            let exchangeRate = result.conversion_rates[toCurrency.value];
            let totalExRate = (amountValue * exchangeRate).toFixed(2);
            exchangeRateTxt.innerText = `${amountValue} ${fromCurrency.value} = ${totalExRate} ${toCurrency.value}`;
        })
        .catch(() => {
            exchangeRateTxt.innerText = "Something went wrong";
        });
}