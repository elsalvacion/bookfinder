document.addEventListener("DOMContentLoaded", () => {
  const key = "AIzaSyDEhH6ZA6yu6E9WVIVu7zyHwf5nkvUHVLo";

  // select all dom elements
  const form = document.querySelector("form");
  const text_input = document.querySelector("#search-input");

  const search_output = document.querySelector("#search-output");

  // global variable
  let text_value;

  // listen for input change
  text_input.addEventListener("keyup", (e) => {
    text_value = e.target.value;
  });

  // listen to submit
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    search_output.innerHTML = "";

    fetchBooks(text_value)
      .then((data) => {
        const spinner = '<img class="spinner" src="img/spinner.gif">';

        search_output.innerHTML = spinner;
        const { items } = data;
        // console.log(data);
        setTimeout(() => {
          search_output.innerHTML = "";
          items.forEach((item) => {
            bookItem(item.volumeInfo);
          });
        }, 1500);
      })
      .catch((err) => console.log(err));
  });

  const bookItem = (item) => {
    console.log(item);

    // authors
    let authors =
      item.authors.length > 1 ? item.authors.join(" & ") : item.authors[0];

    // icons
    let icons = "";
    if (item.averageRating) {
      for (let i = 0; i < Math.floor(item.averageRating); i++) {
        icons += '<i class="material-icons">star</i>';
      }
    }

    if (Math.floor(item.averageRating) < 5 && item.averageRating % 10 >= 3) {
      icons += '<i class="material-icons">star_half</i>';
    }
    console.log(item.averageRating % 10);
    let html = `
      <div class="search-output-cover">
        <img
          src=${item.imageLinks.thumbnail}
          alt="Book Cover"
        />
      </div>
      <div class="search-output-desc">
        <div class="cover-details">
          <h4>Title: ${item.title}</h4>
          <em>Authors: ${authors}</em>
        </div>
        <div class="rates">
         ${icons}
        </div>
        ${item.publisher ? `<p><b>Publisher: </b>${item.publisher}</p>` : ""}

        ${
          item.maturityRating
            ? `<p>
          <b><em>Maturity Rating: </em></b>${item.maturityRating}</p>`
            : ""
        }
       
        <a target="_blank" href=${
          item.previewLink
        } title="Preview Book" class="preview">
          <i class="far fa-eye fa-3x"></i>
        </a>
        <a target="_blank" href=${
          item.infoLink
        } title="More Infomation" class="more">
          <i class="fas fa-info-circle fa-3x"></i>
        </a>
      </div>
        `;

    const search_output_item = document.createElement("div");
    search_output_item.className = "search-output-item";

    search_output_item.innerHTML = html;

    search_output.appendChild(search_output_item);
  };

  const fetchBooks = async (text) => {
    const res = await fetch(
      `https://www.googleapis.com/books/v1/volumes?q=${text}`
    );
    const data = await res.json();
    return data;
  };
});
