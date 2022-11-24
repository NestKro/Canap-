// Помещаем в переменную requestUrl - ссылку для получения данных от сервера
const requestUrl = 'http://localhost:3000/api/products';

// Делаем fetch запрос на сервер - помещаем ссылку на URL в == fetch(url)
fetch(requestUrl)
	// с помощью оператора .then обрабатываем промис от fetch = получем ответ в переменную response и обрабатываем его с помощью метода json для переобразования его в json формат
	.then(response => response.json())
	// получем в переменную res = ответ от сервера в виде масива елементов = товаров, где каждый елемент массива является обьектом у которого есть свои данные про товар 
	.then(res => {
		// делаем реддер продуктов с помощью функии куда в параметры функии мы ложим получемные данные = масив продуктов
		renderProducts(res)
	})
	// Отлавливаем любые возможные ошибки
	.catch((err) => {
		// Если ошибка, то мы находим елемент на странице titles = и если он нашелся на странице этот елемент, то выводим туда надпись ошибка 404
		document.querySelector(".titles") ? document.querySelector(".titles").innerHTML = "<h1>Error 404</h1>" : null;
		// выводим в консоль ошибку 
		console.log("error 404, on api resource: " + err);
	});


// Функция котрая рендерит продукты на основе данных от сервера	
function renderProducts(data) {
	// Находим елемент на странице куда мы будем выводить товары = оболочка
	let contentWrapper = document.getElementById('items');
	// далаем проверку нащелся ли такой елемент на странице
	if(contentWrapper){
		//console.log(data);
		// Если нашелся, то мы с помощью цикла выводим в оболочку(contentWrapper) = html куда мы подставляем нужные данные от ответа от сервера.
		data.forEach(elm => {
			// с помощью консоль лога мы можем посмотеть что такое elm, а это есть обьект = именно каждый товар
			//тут мы пишем, что содержимоеHTML оболочки является прошлое содержимое + новое содежимое от цыкла. С помощью конструкци ${elm._id} мы подставляем нужные данные про каждый товар. Можешь сам посмотреть что свяется каждым значением если это попробудешь вывести в консоль
			contentWrapper.innerHTML +=  `
			<a href="./product.html?id=${elm._id}"> 
				<article>
					  <img src="${elm.imageUrl}" alt="${elm.altTxt}">
					  <h3 class="productName">${elm.name}</h3>
					  <p class="productDescription">${elm.description}</p>
				</article>
			 </a>
			`;
			console.log(elm)
		});
	}
}

