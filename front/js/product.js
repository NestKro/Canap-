// Помещаем в переменную requestUrl - ссылку для получения данных от сервера
const requestUrl = 'http://localhost:3000/api/products';
// с помощью браузерного API - URLSearchParams ищем параметры запроса со строки запроса, там где мы пишем адрес сайта
const locationHref = new URLSearchParams(window.location.search);
// Тут мы получем значение id === того елемента по котрому мы кликнули на странице index.html
const id = locationHref.get("id");

// Делаем fetch запрос на сервер - помещаем ссылку на URL в == fetch(url)
fetch(requestUrl)
	// с помощью оператора .then обрабатываем промис от fetch = получем ответ в переменную response и обрабатываем его с помощью метода json для переобразования его в json формат
	.then(response => response.json())
		// получем в переменную res = ответ от сервера в виде масива елементов = товаров, где каждый елемент массива является обьектом у которого есть свои данные про товар 
	.then(res => {
		// Делаем проверку нашелся ли id в строке поиска 
		if (id) {
			// Если нашелся, то мы запускаем функцию рендерства продукта на странице, эта функия принимает два параметра, это данные от сервера res и id того елемента на котрый мы кликнули. Эта функия возращает нам данные товара  котрый совпадает по id в строке поиска
			const product = renderProduct(res, id);
			// после того как мы вернули данные товара, котрый совпадает по id в строке поиска. Мы этот товар передаем в функию addToCart. Которая начинает отслеживать клик на кнопке дабавления товара в корзину.
			addToCart(product);
		}
	})
	// Отлавливаем любые возможные ошибки
	.catch((err) => {
		// Если ошибка, то мы находим елемент на странице item = и если он нашелся на странице этот елемент, то выводим туда надпись ошибка 404
		document.querySelector(".item") ? document.querySelector(".item").innerHTML = "<h1>Error 404</h1>" : null;
		// выводим в консоль ошибку 
		console.log("error 404, on api resource: " + err);
	});

// Рендерим товар на странице
function renderProduct(data, id) {
	//Получаем нужные нам елементы на странице куда мы будем выводить нужные данные
	const img = document.querySelector('.item__img');
	const title = document.getElementById('title');
	const price = document.getElementById('price');
	const description = document.getElementById('description');
	const colors = document.getElementById('colors');
	let currentProduct;
	// Запускаем цикл по массиве товаров == ответа от вервера
	for (let i = 0; i < data.length; i++) {
		// На каждой итерации цикла = каждый елемента этого массива будет переменная product
		const product = data[i];
		// Спрашиваем если id елемента массива совтадает с id в строке поиска, то мы начинаем заполнять елементы на странице данными из массива = ответа от сервера
		if (product._id === id) {
			// Тут мы заполняем данными про картинку и выводим ее на страницу с помощью innerHTML 
			img.innerHTML = `<img src="${product.imageUrl}" alt="${product.altTxt}">`;
			// Тут название товара с помощью textContent
			title.textContent = product.name;
			// Тут цена товара с помощью textContent
			price.textContent = product.price;
			// Тут описание товара с помощью textContent
			description.textContent = product.description;
			// Тут цвет товара с помощью insertAdjacentHTML. Но тут у нас несколько цветов, поэтому нам нужно запустить цикл map и пробежаться по кажому цвету, сформировать каждый цвет. Цикл map вернет нам массив из цветов по примеру каждый цвет это == <option value="${color}">${color}</option>, дальше нам нужно объеденить ответ цикла map - массива в одну строку с помощью join(). И получается, что в функию insertAdjacentHTML первый аргумент мы указываем позицию куда выводить этот html, а второй аргумент это сам свормированный html с помощью цикла.
			colors.insertAdjacentHTML('beforeend', product.colors.map((color) => {
				return `<option value="${color}">${color}</option>`
			}).join(''))
			// тут мы запоминаем в переменную currentProduct текущий товар, тоесть тот товар корый совпадает с id в стрке поиска
			currentProduct = product;
			// тут мы останавливаем цикл, поскольку мы нашли нужный товар по id и вывели данные на страницу и запомнили нужный товар в переменную currentProduct
			break
		}
	}
	// тут наша функция renderProduct возвращает текущий товар скотрым мы работаем, который совпадет с id в строке поиска
	return currentProduct
}

// находим кнопку добавления товара в корзину и начинаем ее слушать на нажатие - клик
function addToCart(product) {
	//находим кнопку добавления товара в корзину
	const buttonAdd = document.getElementById('addToCart');
	// Слушаем эту кнопку на нажатие мышкой
	buttonAdd.addEventListener('click', () => {
		// если пользователь нажал на добавить товар в корзину, запускаем функцию checkAndAddtoCart. Которая будет запоминать данные о том какой товар пользователь выбрал, его количество и цвет и тогда уже добавляем в корзину. Передаем туда тот товар = данные который совпадает с id в строке поиска.
		checkAndAddtoCart(product)
	})
}
// Функция которая будет запоминать данные о том какой товар пользователь выбрал, его количество и цвет и тогда уже добавляем в корзину.
function checkAndAddtoCart(product) {
	// Находим нужные елементы на странице с которыми мы будем работать
	//Кнопка добавления товара в корзину
	const buttonAdd = document.getElementById('addToCart');
	// Поле количество товара	
	const quantity = document.getElementById('quantity');
	// Выпадающий список select где можна выбрать цвет
	const colors = document.getElementById('colors');
	// Делаем проверку, выбран ли цвет, выбрано ли количество товара от 0 до 100
	if (colors.value !== '' && +quantity.value > 0 && +quantity.value <= 100) {
		// Делаем предварительный обьект товара с нужными данными, его id, цвет, количество и цена и записыыаем его в переменную  productObj
		let productObj = {
			_id: product._id,
			color: colors.value,
			quantity: parseInt(quantity.value),
		}
		// Делаем проверку есть ли переменная added-to-cart в localStorage
		if (localStorage.getItem('added-to-cart')) {
			// если такая переменная есть, то мы запускаем функияю checkForRepetitions которая проверит, если ли повторения, то есть дабавлен ли такой товар с таким же id и таким же цветом уже в такую переменную в localStorage. Функия должна вернуть ответ дабавлен или нет, тесть да, то она вернут true, если нет, то она ничего не вернет
			let resultOfChecking = checkForRepetitions(productObj)
			// тут мы спрашиваем если ответ функции checkForRepetitions является  не false, тоесть такой товар не повторяется, то мы ...
			if (!resultOfChecking) {
				//... получем в переменную localStorItem все добавленые товары из localStorage, а это будет масив
				let localStorItem = JSON.parse(localStorage.getItem('added-to-cart'));
				// тут мы дабавляем новый товар в конец масива с помощью метода push
				localStorItem.push(productObj);
				// тут мы перезаписываем значние пепеменной added-to-cart в localStorage обновленными данными про добавленые товары.
				localStorage.setItem('added-to-cart', JSON.stringify(localStorItem));
			}
		} else {
			// если такой переменной нету, то мы устанавливаем такую переменную в localStorage и ставим ей значение товара productObj = это те данные где указано какое количество товара выбрал пользователь и его цвет, id и цена.
			localStorage.setItem('added-to-cart', JSON.stringify([productObj]));
		}
		// тут мы меняем текст кнопки дабавить в корзину на тот тектс который хранится в дата аттрибудет этой кнопки, если же этот дата атрибут будет не найден, то мы выводим такой текст "Produit ajouté !";
		buttonAdd.textContent = buttonAdd.getAttribute('data-text') ? buttonAdd.getAttribute('data-text') : "Produit ajouté !";
		// тут мы меняем цвет текста кнопки на зеленый
		buttonAdd.style.color = "rgb(0, 205, 0)";
		// Тут мы запускаем функцию слушатель, которая будет проверять если пользователь после уже добавления товара в корзину, начнет еще что-то выбырать, например выберет новый цвет или поставит другое количество этого товара, то мы меням цвет кнопки и текст на первоначальный. Функия принимает в первом аргументе массив из input которые мы будем слушать на изменение (два значения input это количество и цвет), второй аргумент это сама кнопка.
		listenerToInput([quantity, colors], buttonAdd);
	} else {
		// а оначе если цвет не выбран или количество товара отличается от 0 до 100, то мы выводим такой alert
		alert("Pour valider le choix de cet article, veuillez renseigner une couleur, et/ou une quantité valide entre 1 et 100");
	}

}

// Функия проверяет добавлел ли такой товар уже в переменную added-to-cart в localStorage
function checkForRepetitions(productObj) {
	// Тут мы получем в переменную выбраные товары из localStorage
	let addedProducts = JSON.parse(localStorage.getItem('added-to-cart'));
	// тут мы спрашиваем есть ли такая переменная
	if (addedProducts) {
		// если есть, то мы запускаем цикл по массиву всех товарах этой переменной = 
		for (let i = 0; i < addedProducts.length; i++) {
			// в константе elm на каждой итерации хранится товар 
			const elm = addedProducts[i];
			// тут мы проверяем если есть такой товар с таким _id и такой товар с таким же цветом, если да то мы этому товару в localStorage дабавляем количество на +1
			if (elm._id == productObj._id && elm.color == productObj.color) {
				// этому товару в localStorage дабавляем количество на +1
				elm.quantity = (+elm.quantity + +productObj.quantity).toString();
				// после того как мы изменили количество этого товара на +1 то мы переприсваиваем массив товаров addedProducts в такую же переменную added-to-cart. Тоесть мы перезаписываем эту переменную новыми данными, так как у товара случился +1 количество
				localStorage.setItem('added-to-cart', JSON.stringify(addedProducts));
				// Тут мы выводим предупреждение для пользователя, что вы уже добавили этот товар с таким цветом в корзину, и будет +1 по количестку 
				alert("RAPPEL: Vous aviez déja choisit cet article.");
				// эта функия возвращает true, тоесть этот ответ на вопрос было ли повтороения такого товара в переменной added-to-cart в localStorage
				return true;
			}
		}
	}
}

// Функция которая слушает inputs на изменения, и если они происходят, то они меняют цвет текста у кнопки и ее текст на первоначальный.
function listenerToInput(inputs, btn) {
	// тут мы с помощью цикла бежим по массиву inputs,  где должно быть два инпута котрые мы будем слушать это (два значения input это количество и цвет) 
	inputs.forEach(input => {
		// тут мы на каждый input вешаем слушатель на ввод 
		let listerer = input.addEventListener('input', () => {
			// если пользователь после уже добавления товара в корзину, начнет еще что-то выбырать, например выберет новый цвет или поставит другое количество этого товара, то мы меням цвет кнопки и меняем текст на первоначальный 
			btn.textContent = 'Ajouter au panier';
			btn.removeAttribute('style');
			// после проделанных действий мы убераем слушатель
			removeEventListener('input', listerer);
		})
	});
}