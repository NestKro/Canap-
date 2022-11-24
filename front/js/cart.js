const requestUrl = 'http://localhost:3000/api/products';
fetch(requestUrl)
	.then(response => response.json())
	.then(res => {
		working(res);
	})
	.catch((err) => {
		document.querySelector("#cartAndFormContainer").innerHTML = "<h1>Error 404</h1>";
		console.log("error 404, on api resource: " + err);
	});

function working(res){
	const inputsValid = document.querySelectorAll('.input-validation');
	const btnOrder = document.getElementById('order');
	document.addEventListener('click', (e) => {
		const target = e.target;
		// if delete product from cart
		if (target.classList.contains('deleteItem')) {
			deleteProduct(target);
			totalPriceElm(res);
		}
		//if change quantity of added product
		if (target.classList.contains('itemQuantity')) {
			target.addEventListener('input', () => {
				changeQuantityOfProduct(target);
			})
			changeQuantityOfProduct(target);
		}
		// if validate of inputs
		if (target.classList.contains('input-validation')) {
			validationInput(inputsValid);
		}
	})

	renderProductsInCart(res);
	totalPriceElm(res);

	function renderProductsInCart(data) {
		let addedProducts = JSON.parse(localStorage.getItem('added-to-cart'));
		let productWrapper = document.getElementById('cart__items');
		let productData = [];
		if (addedProducts && addedProducts.length > 0) {
			for (let i = 0; i < addedProducts.length; i++) {
				const elm = addedProducts[i];
				sortingSelectedProducts(elm, data, productData)
			}
		}else {
			document.querySelector("h1").innerHTML = "Vous n'avez pas d'article dans votre panier";
		}
		console.log(productData[0]);
		if (productData && productData.length > 0) {
			productData.forEach((elm) => {
				productWrapper.innerHTML += `
				<article class="cart__item" data-id="${elm[0]._id}" data-color="${elm[1].color}">
					<div class="cart__item__img">
						<img src="${elm[0].imageUrl}" alt="${elm[0].altTxt}">
						</div>
					<div class="cart__item__content">
					<div class="cart__item__content__description">
						<h2>${elm[0].name}</h2>
						<p>${elm[1].color}</p>
						<p>${elm[0].price} €</p>
					</div>
					<div class="cart__item__content__settings">
						<div class="cart__item__content__settings__quantity">
							<p>Qté : </p>
							<input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${elm[1].quantity}">
						</div>
						<div class="cart__item__content__settings__delete">
							<p class="deleteItem">Supprimer</p>
						</div>
					</div>
					</div>
				</article>
			`;
			})
		}
		let inputs = document.querySelectorAll('.cart__item__content__settings__quantity input')
		if (inputs) {
			inputs.forEach((input) => {
				changeQuantityOfProduct(input)
			})
		}
		totalPriceElm(res)
	}
	function sortingSelectedProducts(elm, data, arr) {
		data.forEach((item) => {
			if (item._id == elm._id) {
				arr.push([item, elm])
			}
		})
	}
	function changeQuantityOfProduct(input) {
		let addedProducts = JSON.parse(localStorage.getItem('added-to-cart'));
		let article = input.closest('.cart__item');
		const productId = article ? article.getAttribute('data-id') : null;
		const productColor = article ? article.getAttribute('data-color') : null;
		if (input && productId && productColor) {
			let updated = addedProducts.map((elm) => {
				if (elm._id === productId && elm.color === productColor) {
					if (input.value > 100) {
						alert("Le nombre de produits doit être compris entre 1 et 100");
						elm.quantity = 100;
						input.value = 100;
					}
					if (input.value >= 0 && input.value) {
						elm.quantity = parseFloat(input.value);
						input.value = parseFloat(input.value);
					} else {
						elm.quantity = 0;
						input.value = 0;
					}
				}
				return elm;
			})
			localStorage.setItem('added-to-cart', JSON.stringify(updated))
			totalPriceElm(res);
		}
	}
		
	function totalPriceElm(products) {
		const totalQuatityElm = document.getElementById('totalQuantity');
		const totalPriceElm = document.getElementById('totalPrice');
		let data = products;
		let addedProducts = JSON.parse(localStorage.getItem('added-to-cart'));
		if (addedProducts && data) {
			let totalQuatity = 0
			let totalPrice = 0
			addedProducts.forEach((productCart) => {
				data.forEach((product) => {
					if (product._id == productCart._id) {
						totalQuatity += productCart.quantity;
						totalPrice += product.price * productCart.quantity
					}
				})
			})
			totalQuatityElm.textContent = totalQuatity;
			totalPriceElm.textContent = totalPrice;
		} else {
			totalPriceElm.textContent = '0'
			totalQuatityElm.textContent = '0'
		}

		if (addedProducts && addedProducts.length == 0) {
			document.querySelector("h1").innerHTML = "Vous n'avez pas d'article dans votre panier";
		}
	}
	function deleteProduct(btn) {
		let article = btn.closest('.cart__item');
		const productId = article ? article.getAttribute('data-id') : null;
		const productColor = article ? article.getAttribute('data-color') : null;
		let addedProducts = JSON.parse(localStorage.getItem('added-to-cart'));
		if (addedProducts) {
			let updated = addedProducts;
			addedProducts.forEach((elm, index) => {
				if (elm._id == productId && elm.color == productColor) {
					updated.splice(index, 1);
				}
			})
			localStorage.setItem('added-to-cart', JSON.stringify(updated))
			article.remove();
		}
	}

	function validationInput(inputs) {
		inputs.forEach((input) => {
			input.addEventListener('input', () => {
				let inputName = input.getAttribute('id');
				let regexLettre = /^[a-záàâäãåçéèêëíìîïñóòôöõúùûüýÿæœ\s-]{1,31}$/i;
				let regexChiffreLettre = /^[a-z0-9áàâäãåçéèêëíìîïñóòôöõúùûüýÿæœ\s-]{1,60}$/i;
				let regValidationEmail = /^[a-z0-9æœ.!#$%&’*+/=?^_`{|}~"(),:;<>@[\]-]{1,60}$/i;
				let regMatchEmail = /^[a-zA-Z0-9æœ.!#$%&’*+/=?^_`{|}~"(),:;<>@[\]-]+@([\w-]+\.)+[\w-]{2,4}$/i;
				let resultCheckInput = regExpSearch(input, regexLettre);
				let resultCheckAdress = regExpSearch(input, regexChiffreLettre);
				let resultCheckValidEmail = regExpSearch(input, regValidationEmail)
				let resultCheckEmailMatch = regExpMatchEmail(input, regMatchEmail)
				function checking(resultCheck, inputName, resultCheckEmailMatch) {
					if (resultCheck == 0 || input.value == '') {
						setColor(input, resultCheck, inputName);
						setValue(inputName, input);
						if (inputName == 'email' && input.value != "" && resultCheckEmailMatch !== null) {
							input.classList.add('validated');
							setError(input, 'Forme email conforme.')
						}else if(resultCheckEmailMatch == null){
							setColor(input, resultCheckEmailMatch, inputName)
						}
					} else {
						setColor(input, resultCheck, inputName)
						if (inputName == 'email') {
							setError(input, false, 'Caractère non valide');
							input.classList.remove('validated');
						} else {
							setError(input, false, 'Reformulez cette donnée');
						}
					}
				}
				switch (inputName) {
					case 'firstName':
						checking(resultCheckInput, 'firstName')
						break;
					case 'lastName':
						checking(resultCheckInput, 'lastName')
						break;
					case 'address':
						checking(resultCheckAdress, 'address')
						break;
					case 'city':
						checking(resultCheckInput, 'city')
						break;
					case 'email':
						checking(resultCheckValidEmail, 'email', resultCheckEmailMatch)
						break;
				}
				orderBtnStatus(inputs)
			})
		})
	}

	function regExpSearch(input, regExp) {
		return input.value.search(regExp);
	}
	function regExpMatchEmail(input, regExp) {
		return input.value.match(regExp);
	}

	function setColor(input, regResult, inputName) {
		if (regResult == 0) {
			input.style.backgroundColor = "rgb(0, 138, 0)";
			input.style.color = "white";
			if (inputName != 'email') {
				input.classList.add('validated')
			}
			return 'ok'
		}else if (regResult == -1 && input.value !== '') {
			input.style.backgroundColor = "rgb(220, 50, 50)";
			input.style.color = "white";
			input.classList.remove('validated')
		} else if (input.value == '') {
			input.style.backgroundColor = "white";
			input.style.color = "black";
			input.classList.remove('validated')
			return 'ok'
		}		
		if(inputName == 'email' && regResult == null){
			input.style.backgroundColor = "rgb(220, 50, 50)";
			input.style.color = "white";
			input.classList.remove('validated')
		}
	}
	function setValue(key, input) {
			if (input.value == '') {
				if (key == 'email') {
					setError(input, false, false, 'Veuillez renseigner votre email.')
				} else {
					setError(input, false, false, 'Veuillez renseigner ce champ.')
				}
			} else {
				if (key == 'email') {
					setError(input, 'Caratères acceptés pour ce champ. Forme email pas encore conforme')
					input.classList.remove('validated');
				} else {
					setError(input, 'Caratères acceptés pour ce champ.')
				}
			}
	}
	function setError(input, msPositive, msNegative, msClear) {
		let errorElem = input.nextElementSibling;
		if (errorElem && errorElem.hasAttribute('data-error-ms')) {
			errorElem.style.color = "white";
			if (msClear) {
				errorElem.textContent = msClear;
			} else if (msPositive) {
				errorElem.textContent = msPositive;
			} else if (msNegative) {
				errorElem.textContent = msNegative;
			}
		}
	}

	function orderBtnStatus(inputsValid, addedToCart) {
		if (btnOrder.value == 'Commander !') {
			btnOrder.value = 'Remplir le formulaire';
			btnOrder.setAttribute('disabled', '');
		}
		if(inputsValid){
			//Check validation fields
			let res = 0
			inputsValid.forEach((elm) => {
				if (elm.classList.contains('validated')) {
					res++
				}
			})
			if (res == inputsValid.length) {
				btnOrder.removeAttribute('disabled');
				btnOrder.value = 'Commander !';
				return 'ok';
			}
		}
	}
	/**
	 *
	 * Expects request to contain:
	 * contact: {
	 *   firstName: string,
	 *   lastName: string,
	 *   address: string,
	 *   city: string,
	 *   email: string
	 * },
	 * products: [string] <-- array of product _id
	 *
	 */
	btnOrder.addEventListener('click', (e) => {
		e.preventDefault();
		let addedToCart = localStorage.getItem('added-to-cart') ? JSON.parse(localStorage.getItem('added-to-cart')) : undefined;
		if (addedToCart.length == 0) {
			alert('Vous avez un panier vide');
			return
		}
		if (orderBtnStatus(inputsValid) == 'ok') {
			let customerInfo = Array.from(inputsValid).reduce((acc, input)=> { return {...acc, [input.name] : input.value} }, {});
			if (customerInfo && addedToCart && addedToCart.length > 0) {
				let addedProductId = [];
				for (let elm of addedToCart) {
					addedProductId.push(elm._id);
				}
				let orderInfo = {
					contact: {
						firstName: customerInfo.firstName,
						lastName: customerInfo.lastName,
						address: customerInfo.address,
						city: customerInfo.city,
						email: customerInfo.email
					},
					products: addedProductId
				}
				console.log(orderInfo);
				if (orderInfo.products.length != 0) {
					fetch("http://localhost:3000/api/products/order", {
						method: "POST",
						headers: {
							Accept: "application/json",
							"Content-Type": "application/json",
						},
						body: JSON.stringify(orderInfo),
					})
					.then((res) => res.json())
					.then((data) => {
							window.location.href = `../html/confirmation.html?commande=${data.orderId}`;
					})
					.catch(function (err) {
						console.log(err);
						alert("Error");
					});
				}
			}
		}
	})
}


