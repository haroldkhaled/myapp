const productsList = document.querySelector('#products-list');
const form = document.querySelector('#add-products-form')

function renderProducts(doc){
    let li = document.createElement('li');
    let name = document.createElement('span');
    let price = document.createElement('span');
    let stocks =document.createElement('span');
    let cross = document.createElement('div');

    li.setAttribute('data-id', doc.id);
    name.textContent = doc.data().name;
    price.textContent = doc.data().price;
    stocks.textContent = doc.data().stocks;
    cross.textContent = 'x';


    li.appendChild(name);
    li.appendChild(price);
    li.appendChild(stocks);
    li.appendChild(cross);

    productsList.appendChild(li);
    cross.addEventListener('click', (e) => {
        e.stopPropagation();
        let id = e.target.parentElement.getAttribute('data-id');
        db.collection('products').doc(id).delete();
    })
}


/*db.collection('products').orderBy('name').get().then((snapshot) => {
   snapshot.docs.forEach(doc => {
       renderProducts(doc);
   })
});*/

form.addEventListener('submit', (e) => {
    e.preventDefault();
    db.collection('products').add({
        name: form.name.value,
        price: form.price.value,
        stocks: form.stocks.value
    });
    form.name.value = '';
    form.price.value = '';
    form.stocks.value = '';


});

db.collection('products').orderBy('name').onSnapshot(snapshot => {
    let changes = snapshot.docChanges();
    changes.forEach(change => {
    if(change.type == 'added'){
        renderProducts(change.doc);
    } else if (change.type == 'removed'){
        let li = productsList.querySelector('[data-id=' + change.doc.id + ']');
        productsList.removeChild(li);
    }
    })
})
