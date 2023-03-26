// its make a favourites meal array if its not exist in local storage

let favrouite = document.querySelector(".favrouite");
let menuIcon = document.getElementById("menuIcon");
let closeIcon = document.getElementById("closeIcon")
menuIcon.addEventListener("click", function () {
    favrouite.classList.add("active");
    favrouite.classList.remove("hide");
    closeIcon.addEventListener('click', function () {
        favrouite.classList.add("hide");
        favrouite.classList.remove("active");
        console.log("click")
    })
})





if (localStorage.getItem("favouritesList") == null) {
    localStorage.setItem("favouritesList", JSON.stringify([]));
}

// its fetch meals from api and return it
async function fetchMealsFromApi(url,value) {
    const response=await fetch(`${url+value}`);
    const meals=await response.json();
    return meals;
}



// its show's all meals card in main acording to search input value
function showMealList(){
    let inputValue = document.getElementById("my-search").value;
    let arr=JSON.parse(localStorage.getItem("favouritesList"));
    let url="https://www.themealdb.com/api/json/v1/1/search.php?s=";
    let html = "";
    let meals=fetchMealsFromApi(url,inputValue);
    meals.then(data=>{
        if (data.meals) {
            data.meals.forEach((element) => {
                let isFav=false;
                for (let index = 0; index < arr.length; index++) {
                    if(arr[index]==element.idMeal){
                        isFav=true;
                    }
                }
                if (isFav) {
                    html += `
                <div id="card" class="meal">
                    <img src="${element.strMealThumb}"  alt="...">
                    <div class="meal-info">
                        <h5 class="card-title">${element.strMeal}</h5>
                        <div class="meal-icons">
                            <button type="button" class="btn btn-outline-light" onclick="showMealDetails(${element.idMeal})"><i class="fa fa-eye"></i></button>
                            <button id="main${element.idMeal}" class="btn btn-outline-light active" onclick="addRemoveToFavList(${element.idMeal})" style="border-radius:50%">  <i class="fa fa-heart" ></i></button>
                        </div>
                    </div>
                </div>
                `;
                } else {
                    html += `
                <div id="card" class="meal">
                    <img src="${element.strMealThumb}"  alt="...">
                    <div class="meal-info">
                        <h5 class="card-title">${element.strMeal}</h5>
                        <div class="meal-icons">
                            <button type="button" class="btn btn-outline-light" onclick="showMealDetails(${element.idMeal})"><i class="fa fa-eye"></i></button>
                            <button id="main${element.idMeal}" class="btn btn-outline-light" onclick="addRemoveToFavList(${element.idMeal})" style="border-radius:50%"><i class="fa-solid fa-heart"></i></button>
                        </div>
                    </div>
                </div>
                `;
                }  
            });
        } else {
            html += `
            <div class="page-wrap d-flex flex-row align-items-center">
                <div class="container">
                    <div class="row justify-content-center">
                        <div class="col-md-12 text-center">
                            <span class="display-1 d-block">404</span>
                            <div class="mb-4 lead">
                                The meal you are looking for was not found.
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            `;
        }
        document.getElementById("main").innerHTML = html;
    });
}



//its shows full meal details in main
async function showMealDetails(id) {
    let url="https://www.themealdb.com/api/json/v1/1/lookup.php?i=";
    let html="";
    await fetchMealsFromApi(url,id).then(data=>{
        html += `
          <div id="meal-details" class="meal-details">
            <div id="meal-header" class="meal-details-top">
              <div id="meal-thumbail">
                <img src="${data.meals[0].strMealThumb}" alt="" srcset="">
              </div>
              <div id="details">
                <h3>${data.meals[0].strMeal}</h3>
                <h6>Category : ${data.meals[0].strCategory}</h6>
                <h6>Area : ${data.meals[0].strArea}</h6>
              </div>
            </div>
            <div class="meal-details-bottom">
            <div id="meal-instruction" class="mt-3">
              <h3 class="instruction">Instruction :</h3>
              <p>${data.meals[0].strInstructions}</p>
            </div>
            <div class="video">
              <a href="${data.meals[0].strYoutube}" target="_blank"">Watch Video</a>
            </div>
            </div>
          </div>
        `;
    });
    document.getElementById("main").innerHTML=html;
}




// its shows all favourites meals in favourites body
async function showFavMealList() {
    let arr=JSON.parse(localStorage.getItem("favouritesList"));
    let url="https://www.themealdb.com/api/json/v1/1/lookup.php?i=";
    let html="";
    if (arr.length==0) {
        html += `
            <div class="page-wrap d-flex flex-row align-items-center">
                <div class="container">
                    <div class="row justify-content-center">
                        <div class="col-md-12 text-center">
                            <span class="display-1 d-block">404</span>
                            <div class="mb-4 lead">
                                No meal added in your favourites list.
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            `;
    } else {
        for (let index = 0; index < arr.length; index++) {
            await fetchMealsFromApi(url,arr[index]).then(data=>{
                html += `
                <div id="card" class="meal">
                    <img src="${data.meals[0].strMealThumb}" class="card-img-top" alt="...">
                    <div class="meal-info">
                        <h3 class="card-title">${data.meals[0].strMeal}</h3>
                        <div class="meal-icons">
                            <button type="button" class="btn btn-outline-light" onclick="showMealDetails(${data.meals[0].idMeal})"><i class="fa fa-eye"></i></button>
                            <button id="main${data.meals[0].idMeal}" class="btn btn-outline-light active" onclick="addRemoveToFavList(${data.meals[0].idMeal})" style="border-radius:50%"><i class="fa fa-heart" ></i></button>
                        </div>
                    </div>
                </div>
                `;
            });   
        }
    }
    document.getElementById("favourites-body").innerHTML=html;
}






//its adds and remove meals to favourites list
function addRemoveToFavList(id) {
    let arr=JSON.parse(localStorage.getItem("favouritesList"));
    let contain=false;
    for (let index = 0; index < arr.length; index++) {
        if (id==arr[index]) {
            contain=true;
        }
    }
    if (contain) {
        let number = arr.indexOf(id);
        arr.splice(number, 1);
        alert("your meal removed from your favourites list");
    } else {
        arr.push(id);
        alert("your meal add your favourites list");
    }
    localStorage.setItem("favouritesList",JSON.stringify(arr));
    showMealList();
    showFavMealList();
}