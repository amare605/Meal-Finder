// const
const search = document.getElementById('search'),
      submit = document.getElementById('submit'),
      random = document.getElementById('random'),
      mealsEl = document.getElementById('meals'),
      resultHeading = document.getElementById('result-heading'),
      single_mealEl = document.getElementById('single-meal');

// function 
// 搜尋餐點和call mealdb api
function searchMeal(e) {
    // 停止submit的動作
    e.preventDefault();

    // 清除 Single meal
    single_mealEl.innerHTML = '';

    // 取得搜尋的資料
    const term = search.value;

    // 檢查是否為空
    if(term.trim()) {
        // fetch api
        fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${term}`)
        // 將取得的資料json化
        .then(respond => respond.json())
        // 顯示查詢結果資料
        .then(data =>{
            // 顯示在console 之後debug用
            console.log(data);

            // resultheading 顯示訊息
            resultHeading.innerHTML = `<h2>搜尋 ${term} 的結果為:</h2>`;

            //查無資料
            if(data.meals === null) {
                resultHeading.innerHTML = `查無資料，請輸入其他關鍵字查詢`;
            } else {
            //有資料，查詢結果顯示在mealsEl
                mealsEl.innerHTML = data.meals.map(
                    meal => `
                    <div class="meal">
                        <img src="${meal.strMealThumb}" alt="${meal.strMeal}" />
                        <div class="meal-info" data-mealID="${meal.idMeal}">
                        <h3>${meal.strMeal}</h3>
                        </div>
                    </div>
                    `
                ).join('');
            }
        });
        // 清除搜尋欄位
        search.value ='';
    }   else {
        window.alert('請輸入查詢條件');
    }

}      
     
// Fetch Random Meal
function getRandomMeal(){
    // 清除mealsEl 和 resultHEading
    mealsEl.innerHTML = '';
    resultHeading.innerHTML = '';

    // fetch random meal
    fetch('https://www.themealdb.com/api/json/v1/1/random.php')
    .then(respond => respond.json())
    .then(data => {
        const meal = data.meals[0];
        console.log(meal);

        //新增到UI
        addMealToDOM(meal);
    })

}

function addMealToDOM(meal){    
    // 把所有ingredients 加入到array >>> 這用之後就可以用這個array
    const ingredients = [];

    for (let i = 1; i <= 20; i++) {
      if (meal[`strIngredient${i}`]) {
        ingredients.push(
          `${meal[`strIngredient${i}`]} - ${meal[`strMeasure${i}`]}`
        );
      } else {
        break;
      }
    }
    console.log(ingredients);
    // 顯示在UI single_mealEl
    single_mealEl.innerHTML = `
        <div class="single-meal">
            <h1>${meal.strMeal}</h1>
            <img src="${meal.strMealThumb}" alt="${meal.strMeal}" />
            <div class="single-meal-info">
                ${meal.strCategory ? `<p>${meal.strCategory}</p>` : ''}
                ${meal.strArea ? `<p>${meal.strArea}</p>` : ''}
            </div>
            <div class="main">
                <p>${meal.strInstructions}</p>
                <h2>食材</h2>
                <ul>
                    ${ingredients.map(ing => `<li>${ing}</li>`).join('')}
                </ul>
            </div>
        </div>   
    `;


}

// 取得mealid
function getMealById(mealID){
    // FETCH ID
    fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealID}`)
    .then(res => res.json())
    .then(data => {
      const meal = data.meals[0];

      //新增到UI
      addMealToDOM(meal);
    });
}


// 點選查詢結果的詳細資料
function singlMealDetails(e){
    const mealInfo = e.path.find(item => {
        // 找classlist 有含meal-info的
        if (item.classList) {
          return item.classList.contains('meal-info');
        } else {
          return false;
        }
      });
      
        //如果有mealinfo
      if (mealInfo) {
        const mealID = mealInfo.getAttribute('data-mealid');
        // 將data-mealid傳入 getmealbyID
        getMealById(mealID);
      }
}


// event listner
submit.addEventListener('submit' ,searchMeal);
random.addEventListener('click', getRandomMeal);
meals.addEventListener('click', singlMealDetails);