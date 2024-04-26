const transactionsBtn = document.querySelector(".transactions__btn");
const transactionsBox = document.querySelector(".transactions__box");
const transactionsSearch = document.querySelector(".transactions__search");
const transactionsTableContent = document.querySelector(
  ".transactions__table__content"
);
const priceSortIcon = document.querySelector(".price__sort");
const dateSortIcon = document.querySelector(".date__sort");
const searchInput = document.querySelector(".search__input");
const searchIcon = document.querySelector(".search__icon");

let sort = {
  price: "desc",
  date: "desc",
};
let searchQuery = "";

transactionsBtn.addEventListener("click", getTransactions);
priceSortIcon.addEventListener("click", priceSort);
dateSortIcon.addEventListener("click", dateSort);
searchIcon.addEventListener("click", searchTransactions);
searchInput.addEventListener("keydown", (e) => {
  if (e.key === 'Enter') searchTransactions()
})
searchInput.addEventListener("blur", searchTransactions)

function renderTransactions(transactions) {
  transactionsTableContent.innerHTML = "";
  transactionsTableContent.classList.remove("transactions__empty");
  if (transactions.length > 0) {
    transactions.forEach((transaction) => {
      const transactionDiv = document.createElement("div");
      transactionDiv.classList.add("table__row");
      transactionDiv.innerHTML = `
            <div>${transaction.id}</div>
            <div class=${
              transaction.type === "افزایش اعتبار"
                ? "transaction__success"
                : "transaction__unsuccess"
            }>
            ${transaction.type}
            </div>
            <div class="transaction__price">${new Intl.NumberFormat().format(
              transaction.price
            )}</div>
            <div>${transaction.refId}</div>    
        <div>${new Date(transaction.date).toLocaleDateString(
          "fa-IR"
        )} ساعت ${new Date(transaction.date).toLocaleTimeString("fa-IR", {
        hour: "2-digit",
        minute: "2-digit",
      })}</div>
            `;
      transactionsTableContent.appendChild(transactionDiv);
    });
  } else {
    transactionsTableContent.classList.add("transactions__empty");
    transactionsTableContent.innerHTML = `<p>
    تراکنشی وجود ندارد
  </p>`;
  }
}
function priceSort() {
  if (sort.price === "desc") {
    sort.price = "asc";
    priceSortIcon.classList.add("arrow__icon");
    sort.date = "desc";
    dateSortIcon.classList.remove("arrow__icon");
  } else {
    sort.price = "desc";
    priceSortIcon.classList.remove("arrow__icon");
  }
  getTansactionsData(
    `${searchQuery ? searchQuery + "&" : ""}_sort=price&_order=${sort.price}`
  );
}
function dateSort() {
  if (sort.date === "desc") {
    sort.date = "asc";
    dateSortIcon.classList.add("arrow__icon");
    sort.price = "desc";
    priceSortIcon.classList.remove("arrow__icon");
  } else {
    sort.date = "desc";
    dateSortIcon.classList.remove("arrow__icon");
  }
  getTansactionsData(
    `${searchQuery ? searchQuery + "&" : ""}_sort=date&_order=${sort.date}`
  );
}
function searchTransactions() {
  sort = {
    price: "desc",
    date: "desc",
  };
  priceSortIcon.classList.remove("arrow__icon");
  dateSortIcon.classList.remove("arrow__icon");
  const search = searchInput.value
  searchQuery = search ? `refId_like=${search}` : "";
  getTansactionsData(searchQuery);
}
function getTransactions() {
  getTansactionsData("");
  transactionsBtn.classList.add("hidden");
  transactionsBox.classList.remove("hidden");
  transactionsSearch.classList.remove("hidden");
}
function getTansactionsData(query) {
  axios
    .get(`http://localhost:3000/transactions${query ? "?" + query : ""}`)
    .then((res) => {
      renderTransactions(res.data);
    })
    .catch((err) => console.log(err));
}