//Author: Alex Junkins, Adrian Muth, Daniel Co and Justin Cao
//Version: April 4 2021
// Pulls information on items from database and loads items based on keys

$(function () {

    let CatalogItemsFull = [];
    let CatalogItems = [];

    const itemName = document.getElementById('itemName');
    const modelText = document.getElementById('modelText');
    const categoryText = document.getElementById('categoryText');
    const usesText = document.getElementById('usesText');
    const accessoriesText = document.getElementById('accessoriesText');
    const descriptionText = document.getElementById('descriptionText');
    const similarItems = document.getElementById('similarItemsWrapper');

    const deleteRestoreButton = document.getElementById('deleteButton');

    var placeholderImage = "https://lh3.googleusercontent.com/GQIuf05jvVfDru6tdwR_zEsRhNj59K3QKANkpQCS4cxinfu4DiwkCFFM0oi71calYudq9D4-jjwFYv1U0raDqP4blg0SkR3wQRLN4CmL1bHeLdmrnsFxMLiWo0ttWxLmfVNdIKz0KAAn7iSBs3NsOoCP7mQpnvdRdWWjy6DChe_E_BFOOxwfM01P5BwYy_FyHtWaYziquGADRjymlp9Xls_H-67k7JMFU8E3FRW4ZA1-rAk2VWmccJW3kQEwRzvL0zOmfss47m6rvKQXRZCdpNFgfsLxfPhmFfxNg8i5NUjgXFwTlkg4uLsklfeWRqG87K0snnoy-KuTj040_2PuicI9LQuMo5UwaGNReCGfOb5fEgy_ogXfmlUZWwENyqnnlHXYEHaYokz8HajekTkVo-apRo88_l9mKrHZbMHra9ukgJj0T878vC-_o4AKxkLSKZvF_l54RTlGM5sO5ET2M68uHensYDY9jl_-Hf9nhQyA_gLxQNtZkzX3rkm_WK3_br1hzz9XDQxGEaPKVvtp-ZE-oOQvCbme6h_y0kVS0MQ5Esvi1YHMHSfr2ddgVZvsMWSbwLWwUkHQUctFNB8UlgdavPGFcy5aCR27sdJbqB8Ea0NOOMn9DperBRpoFRw8hSt1M0mvaaaqfRlJtKPGihnkhxgA_taDfAchqrG9xxPayCXtXt50RS49VyJM5bdU4d7wlNTp5OWsY_8KaoSwe9yW=w2454-h1642-no?authuser=0";
    
    //Delete/Restore button functionality is only allowed on the ADMIN version of the individual page
    if(deleteRestoreButton != null){
        deleteRestoreButton.addEventListener('click', (e) => {
            deleteOrRestoreItem();
        });
    }

    //Delete/Restore button uses the item key and item categories to send a POST request for item deletion or restoration
    function deleteOrRestoreItem(){
        //pull query String from selected url
        var itemKey = location.search.substring(1);

        //get item object from catalog  (key-1 because item keys are indexed starting at 1)
        var itemSearched = CatalogItems[itemKey - 1];

        productKey = { 
            item_key:itemKey,
            category:itemSearched.category
        }

        //BIG PROBLEM
        //this presents a way for users to insert custom SQL code into the database
        //we could add something to verify that the item key is an integer and the 
        //category only has strings that are valid categories in the future

        //attempt deletion or restoration w/ POST
        var routerKey = "";
        if(deleteRestoreButton.value == "Delete Item"){
            console.log("Attempting to delete item from key with POST");
            routerKey = '/keyDelete';
        } else if(deleteRestoreButton.value == "Restore Item"){
            console.log("Attempting to restore item from key with POST");
            routerKey = '/keyRestore';
        }
        $.post({
            traditional: true,
            url: routerKey,    // url
            data: productKey,
            dataType: 'json',
            success: function(data, ) {// success callback
                successDeleteOrRestore(data);
            }
        }).fail(function(jqxhr, settings, ex) { 
            alert("Couldn't access server." + ex); 
        });
    }

    //reloads catalog after an item has been deleted
    function successDeleteOrRestore(data){
        if (data == false){
            location.reload();
        }
    }


    /*
    loadItems is the first method called when the script is run. This method populates our CatalogItems array
    and makes a call to displays all items contained. 
    */
    const loadItems = async () => {
        // if items have already been loaded during the session, retrieve them from sessionStorage
        if (sessionStorage.getItem("catalog_items"))
        {
            CatalogItemsFull = JSON.parse(sessionStorage.getItem("catalog_items"));
            CatalogItems = CatalogItemsFull;
            // populate the page (this code would be called in readServerData if we had queried the sql server)
            populatePage()
        }
        else 
        {
            //Populate CatalogItemsFull with data from the SQL server
            //only do so if the variable is empty (the data has not been loaded yet)
            if (CatalogItemsFull.length == 0) {
                console.log("Attempting to access item data with POST");
                $.post({
                    traditional: true,
                    url: '/catalogData',    // url
                    success: function (data,) {// success callback
                        readServerData(data);
                        // save items to sessionStorage
                        sessionStorage.setItem("catalog_items",JSON.stringify(CatalogItemsFull));
                    }
                }).fail(function (jqxhr, settings, ex) {
                    alert('Accessing product data failed, ' + ex + "\nLoading static dataset.");
                    loadStaticDataset();
                });
            }

            //load maellable list
            CatalogItems = CatalogItemsFull;

        }

    };

    function loadStaticDataset() {
        CatalogItems = [{ name: "Canon DLSR", image: "", category: "recording" },
        { name: "Canon R", image: "https://static.bhphoto.com/images/images1000x1000/1536120359_1433711.jpg", category: "recording" },
        { name: "Canon 80D", image: "https://www.bhphotovideo.com/images/images2500x2500/canon_1263c005_eos_80d_dslr_camera_1225876.jpg", category: "recording" },
        { name: "Canon 90D", image: "https://images-na.ssl-images-amazon.com/images/I/61f9Hy-cujL._AC_SX679_.jpg", category: "recording" },
        { name: "Vanko", image: "https://pisces.bbystatic.com/image2/BestBuy_US/images/products/6419/6419996_sd.jpg;maxHeight=200;maxWidth=300", category: "conferencing" },
        { name: "Epson - HC 3800", image: "https://pisces.bbystatic.com/image2/BestBuy_US/images/products/6366/6366530_sd.jpg;maxHeight=200;maxWidth=300", category: "conferencing" },
        { name: "Epson - HC 2250", image: "https://pisces.bbystatic.com/image2/BestBuy_US/images/products/6428/6428462_sd.jpg;maxHeight=200;maxWidth=300", category: "conferencing" },
        { name: "LG - PF50KA", image: "https://pisces.bbystatic.com/image2/BestBuy_US/images/products/6228/6228221_sd.jpg;maxHeight=200;maxWidth=300", category: "conferencing" },
        { name: "Logitech - C922", image: "https://pisces.bbystatic.com/image2/BestBuy_US/images/products/5579/5579380_sd.jpg;maxHeight=200;maxWidth=300", category: "streaming" },
        { name: "Logitech - HD Webcam", image: "https://pisces.bbystatic.com/image2/BestBuy_US/images/products/9928/9928354_sa.jpg;maxHeight=200;maxWidth=300", category: "streaming" }]
    }

    
    
    //A helper function to read items from the database format into the local CatalogItems format 
    //and load into CatalogItemsFull
    function readServerData(data) {
        console.log("Attempting to load item data from SQL server");
        //console.log(data)
        productDataArray = data.productData;
        console.log(productDataArray);
        productImageArray = data.imageData;
        console.log(productImageArray);
        var i;
        // CatalogItemsFull.length = productDataArray.length - 1;
        console.log("productDataArray Length: " + productDataArray.length);
        console.log("productImageArray Length: " + productImageArray.length);
        console.log("CatalogItemsFull Length: " + CatalogItemsFull.length);
        for (i = 0; i < productDataArray.length; i++) {
            prodData = productDataArray[i];
            //console.log("productDataArray[" + i + "]");
            console.log(prodData);
            // assigns brand name
            var b = prodData.brand;
            if (b == null) {
                b = "No_Brand";
            }
            // assigns model name
            var n = prodData.model_num;
            if (n == "" || n == null) {
                n = "No_Model";
            }
            // combines brand and model for full title
            var bn = b + " " + n;

            var k = prodData.item_key;
            // console.log("type of key" + typeof(k));
            if (k == null){
                k = "";
            }

            //get the correct image
            var img = null;
            var imgValue = prodData.picture;
            if (imgValue != null){
                if (imgValue == "YES"){
                    //get the first image where item key matches image's key number
                    for(let j = 0; j < productImageArray.length; j++){
                        if (k == productImageArray[j].key_number){
                            img = productImageArray[j].image;
                            console.log("Found image for " + bn + ": " + img);
                            break;
                        }
                    }
                    if (img == null){
                        img = placeholderImage;
                        console.log("Couldn't find image for " + bn);
                    }
                } else {
                    img = placeholderImage;
                }
            } else {
                img = placeholderImage;
            }




            // assigns category
            var c = prodData.category;
            if (c == null) {
                c = "";
            }
            // assigns description
            var d = prodData.description;
            if (d == null) {
                d = "No description.";
            }
            // assigns uses
            var u = prodData.uses;
            nullvar = "NULL";
            if (u != null){
                if (u.normalize().valueOf() == nullvar.valueOf()) {
                    u = "No uses.";
                }
            } else {
                u = "No uses."
            }
            //temporary line, uncil accessories are added
            var a = "No accessories."

            var productjson = {itemKey:k, name:bn, brand:b, model:n, image:img, category:c, uses:u, accessories:a, description:d};
            CatalogItemsFull[i] = productjson;
        }
        console.log(CatalogItemsFull);
        console.log("Item loading complete!");

        //once database has loaded, populate page
        populatePage();
    }
  
    /*
    populatePage finds the item in the database based of item_key that is sent though the string query 
    */
    function populatePage() {
        //pull query String from selected url
        var itemKey = location.search.substring(1);
        
        //get item object from catalog  (key-1 because item keys are indexed starting at 1)
        var itemSearched = CatalogItems[itemKey - 1];

        if (itemSearched != null) {
            updatePageText(itemSearched);
        } else {
            console.log("Item could not be found by name.");
            alert("failed to find item name in catalog");
        }
    }

    /*
    updatePageText takes an item and transfers its attributes to the html page ()
    */
    function updatePageText(item) {

        console.log(deleteRestoreButton);

        //add more initiations when more data is avaliable from database team
        if(item.category.toLowerCase().includes("deleted")){
            itemName.innerHTML = item.name + " (deleted)";
            if(deleteRestoreButton != null){
                deleteRestoreButton.value = "Restore Item";
            }
        } else{
            itemName.innerHTML = item.name;
        }
        modelText.innerHTML = item.brand + "/" + item.model;
        var categoriesArray = item.category.split(" ");
        var categoriesString = categoriesArray[0];
        var i;
        for (i = 1; i < categoriesArray.length; i++){
            categoriesString = categoriesString + ", " + categoriesArray[i];
        }
        categoryText.innerHTML = categoriesString;
        usesText.innerHTML = item.uses;
        accessoriesText.innerHTML = item.accessories;
        descriptionText.innerHTML = item.description;
        document.getElementById('mainImage').src = item.image;

        // Create randomly sorted catalog to vary similar items
        const RandomCatalog = CatalogItemsFull.sort(() => Math.random() - 0.5);

        //DIDNT HAVE TIME TO GET THE SIMILAR RANDOMIZATION TO WORK WITH MAP

        // get pictures for Similar Items by matching item categories
        var similarImagesArray = [];
        for (i = 0; i < RandomCatalog.length; i++){
            if (!RandomCatalog[i].category.toLowerCase().includes("deleted")){
                // don't use image if it's the item itself
                if(RandomCatalog[i].name.toLowerCase() === item.name.toLowerCase()){
                    continue;
                }
                // iterate through categories of items until match is found
                var itemCategories = RandomCatalog[i].category.split(" ");
                for (k = itemCategories.length-1; k >= 0; k--){
                    for(m = categoriesArray.length-1; m >= 0; m--){
                        // if catagory match is found
                        if (itemCategories[k].toLowerCase() === categoriesArray[m].toLowerCase()){
                            similarImagesArray.push(RandomCatalog[i]);
                            k = m = -1;     // break double nested array
                        }
                    }
                }
            }
        }
        var similarImages = [];
        for (var i = 0; i < 3 ; i++) {
            similarImages.push(similarImagesArray[i]); 
        }
        const htmlString = similarImages
            .map((item, index) => {
                return ` 
                <a href="VIEWER_individual_page.html?${item.itemKey}">
                    <div class="similarItemContainer">
                        <img class="similarItemImage" src="${item.image}" alt="image of ${item.name}">
                    </div>
                </a>
                `;        
            })
        // replace placeholder images with similarImagesArray
            similarItems.innerHTML = htmlString;
        // replace placeholder images with similarImagesArray
        // similarImagesDisplay = ['similarImage1', 'similarImage2', 'similarImage3'];
        // for (j = 0; j < 4; j++){
        //     // display nothing in empty slots if < 3 items are in similarImagesArray, else display the items accordingly
        //     if(similarImagesArray[j] == null){
        //         document.getElementById(similarImagesDisplay[j]).style.display = 'none';
        //     } else {
        //         document.getElementById(similarImagesDisplay[j]).src = similarImagesArray[j];
    }

    //load items when page starts 
    loadItems();
});