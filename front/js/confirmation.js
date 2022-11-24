const page = document.location.href;
function Commande() {
	if (page.match("confirmation")) {
		sessionStorage.clear();
		localStorage.clear();
		let numOrder = new URLSearchParams(document.location.search).get("commande");
		document.querySelector("#orderId").innerHTML = `<br>${numOrder}<br>Merci pour votre achat`;
		console.log("valeur de l'orderId venant de l'url: " + numOrder);
		numOrder = undefined;
	}
};
Commande()