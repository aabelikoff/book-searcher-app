function createBookTableRow(
  rowCount,
  { author_name: [author], title, first_publish_year: year = "", number_of_pages_median: pages = "" }
) {
  const trElem = document.createElement("tr");
  trElem.innerHTML = `
    <th scope="row">${rowCount}</th>
    <td>${author}</td>
    <td>${title}</td>
    <td>${year}</td>
    <td>${pages}</td>`;
  return trElem;
}

function createBookTableHeader() {
  const theadElem = document.createElement("thead");
  theadElem.innerHTML = `
    <tr class='align-items-center table-primary'>
        <th scope="col"">#</th>
        <th scope="col">Author name</th>
        <th scope="col">Title</th>
        <th scope="col" class='w-25'>First publish year</th>
        <th scope="col">Pages</th>
    </tr>`;
  return theadElem;
}

function createBookTable(offset, bookArray) {
  const tableElem = document.createElement("table");
  tableElem.id = "results";
  tableElem.className = "table table-hover";
  const theadElem = createBookTableHeader();
  tableElem.append(theadElem);
  const tbodyElem = document.createElement("tbody");
  tableElem.append(tbodyElem);
  bookArray.forEach((bookInfo, index) => {
    const trElem = createBookTableRow(++offset, bookInfo);
    if (index % 2) {
      trElem.classList.add("table-primary");
    }
    tbodyElem.append(trElem);
  });
  return tableElem;
}
