//SELECTORES

//SELECCIONO EL LUGAR DONDE VOY A MOSTRAR LOS POKEMON EN MI DOCUMENTO HTML
const listaPokemon = document.getElementById("listaPokemon");

//SELECCIONO LOS BOTONES PARA EL FILTRADO
const botonesHeader = document.querySelectorAll(".btn-header");

//SELECCIONO EL FORM DE BUSQUEDA
const form = document.getElementById("search-form");
const input = document.getElementById("search-input");

let allPokemons = [];

//ALMACENO LA URL EN UNA VARIABLE
let enlace = "https://pokeapi.co/api/v2/pokemon/";

//CREO LA FUNCIÓN PARA HACER LA PETICIÓN A LA API Y DEVOLVER LA DATA
async function getPokemon(id){
    const response = await fetch(enlace + id);
    if (!response.ok){
        throw new Error ("No se encuentra el pokemon");
    }
    const data = await response.json()
    return data
}

//CREO UNA FUNCIÓN PARA CARGAR PREVIAMENTE LOS POKEMON ANTES DE MOSTRAR
async function loadPokemon() {

    try{
        //DECLARO EL ARRAY DONDE SE ALMACENARÁN LAS PROMESAS OBTENIDAS 
        const promises = [];
        for (let i = 1; i <= 151; i++) {
            
            // if (i == 4)
            //     promises.push(getPokemon("X"))
            // else promises.push(getPokemon(i))

            promises.push(getPokemon(i)) //AGREGO EL POKEMON AL ARRAY

        }
        
        
        // ALMACENO EL CONTENIDO DE PROMESAS CON SUS RESULTADOS FINALES (fulfilled/rejected)
        const pokemons = await Promise.allSettled(promises);

        // ALLSETTLED: Esta función espera a que todas las promesas del array terminen, sin importar si se resolvieron o fallaron.
        // AWAIT: hace que el código espere hasta que Promise.allSettled() haya terminado con todas las promesas.

        console.log(pokemons)

        // ALMACENO LOS RESULTADOS "fulfilled" EN UN NUEVO ARRAY (ESTAS SON LAS PETICIONES EXITOSAS)
        const succesful = pokemons
            .filter( r => r.status === "fulfilled")
            .map(r => r.value);

        //.filter: filtra el array anterior, dejando solo los objetos cuyo estado fue exitoso (fulfilled).
        //.map: transforma el array anterior para quedarse solo con los valores (value) de esas promesas.

        console.log(succesful)

        //Tomo cada elemento del array succesful y lo transformo en una cadena HTML usando la función createCard() mediante map(). Luego, con join(""), uno todas esas cadenas en un solo string sin usar ningún carácter delimitador.
        //const card = succesful.map(p => createCard(p))/*.join("")*/ //esto solo sirve para el innetHTML

        for (const p of succesful){
            const cardElement = createCard(p);
            listaPokemon.appendChild(cardElement);
            allPokemons.push(p);
            
        }

        console.log(card)
        
        //let contenedor = document.getElementById("listaPokemon")
        //contenedor.innerHTML= card
            

    }catch(error){
        console.error("Error en loadPokemon:", error);
    }
    
}

loadPokemon()

//CREO LA ESTRUCTURA HTML DE LA CARTA 
/* function createCardV1(pokemon){
    return `
        <div class="pokemon">
            <p class="pokemon-id-back">#025</p>

            <div class="pokemon-imagen">
                <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png" alt="Pikachu">
            </div>

            <div class="pokemon-info">

                <div class="nombre-contenedor">
                    <p class="pokemon-id">#025</p>
                    <h2 class="pokemon-nombre">Pikachu</h2>
                </div>  

                    <div class="pokemon-tipos">
                        <p class=" electric tipo">ELECTRIC</p>
                        <p class="fighting tipo ">FIGHTING</p>
                    </div>

                    <div class="pokemon-stats">
                        <p class="stat">4m</p>
                        <p class="stat">60kg</p>
                    </div>
                
            </div>

        </div> 
    `
}  */
function createCard(pokemon){

    let pokeId = pokemon.id.toString();
    if (pokeId.length ===1){
        pokeId="00"+pokeId;
    }else if (pokeId.length ===2){
        pokeId="0"+pokeId;
    }

    // 1 .CONTENEDOR PRINCIPAL
    const divPokemon = document.createElement("div");
    divPokemon.classList.add("pokemon");

    // 2. ID BACK
    const idBack = document.createElement("p");
    idBack.classList.add("pokemon-id-back");
    idBack.textContent = `#${pokeId}`;
    divPokemon.appendChild(idBack);

    // 3. POKEMON-IMAGEN
    const divPokemonImagen = document.createElement("div");
    divPokemonImagen.classList.add("pokemon-imagen");

    const img = document.createElement("img");
    img.src = pokemon.sprites.other["official-artwork"].front_default;

   /*  img.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.id}.png`; */
    img.alt = pokemon.name;

    divPokemonImagen.appendChild(img);
    divPokemon.appendChild(divPokemonImagen);

    // 4. DIV INFO
    const divInfo = document.createElement("div");
    divInfo.classList.add("pokemon-info");

    // 5. NOMBRE CONTENEDOR
    const divNombre = document.createElement("div");
    divNombre.classList.add("nombre-contenedor");
    
    // 5.1 p
    const pNombreContenedor = document.createElement("p");
    pNombreContenedor.classList.add("pokemon-id");
    pNombreContenedor.textContent = `#${pokeId}`;

    // 5.2 h2
    const h2Nombre = document.createElement("h2");
    h2Nombre.classList.add("pokemon-nombre");
    h2Nombre.textContent = pokemon.name;

    divNombre.appendChild(pNombreContenedor);
    divNombre.appendChild(h2Nombre);

    divInfo.appendChild(divNombre);

    // tipos
    const divTipos = document.createElement("div");
    divTipos.classList.add("pokemon-tipos");
    pokemon.types.forEach(t => {

        const pTipo = document.createElement("p");

        pTipo.classList.add(t.type.name, "tipo");
        pTipo.textContent = t.type.name.toUpperCase();
        divTipos.appendChild(pTipo);

    });
    
    divInfo.appendChild(divTipos);

    // stats (altura y peso)
    const divStats = document.createElement("div");
    divStats.classList.add("pokemon-stats");

    const altura = document.createElement("p");
    altura.classList.add("stat");
    // height y weight en API están en decímetros/hectogramos -> convierto
    altura.textContent = `${pokemon.height / 10} m`;

    const peso = document.createElement("p");
    peso.classList.add("stat");
    peso.textContent = `${pokemon.weight / 10} kg`;

    divStats.appendChild(altura);
    divStats.appendChild(peso);
    divInfo.appendChild(divStats);

    // añado info al contenedor principal
    divPokemon.appendChild(divInfo);

    return divPokemon;

} 

//FILTROS

function filtrarPokemon(tipo) {
    // Limpio el contenedor
    listaPokemon.innerHTML = "";

    // Si tipo es "ver-todos", mostramos todos
    if(tipo === "ver-todos") {
        allPokemons.forEach(p => {
            listaPokemon.appendChild(createCard(p));
        });
        return;
    }

    // Filtro los Pokémon por tipo
    const filtrados = allPokemons.filter(p => 
        p.types.some(t => t.type.name === tipo)
    );

    
    if(filtrados.length === 0){
        // Si no hay Pokémon, mostrar mensaje
        const mensaje = document.createElement("p");
        mensaje.textContent = `No hay Pokémon de tipo ${tipo.toUpperCase()}  `;
        mensaje.style.fontSize = "1 rem";
        mensaje.style.textAlign = "center";
        mensaje.style.marginTop = "2rem";
        mensaje.style.color = "var(--clr-gray)"
        listaPokemon.appendChild(mensaje);
        return;
    }

    // Creo las cartas de los filtrados
    filtrados.forEach(p => {
        listaPokemon.appendChild(createCard(p));
    });
}

function buscarPokemon(nombre) {
    // Limpio el contenedor
    listaPokemon.innerHTML = "";

    // Si el input está vacío, muestro todos los Pokémon
    if(nombre === "") {
        allPokemons.forEach(p => {
            listaPokemon.appendChild(createCard(p));
        });
        return;
    }

    // Filtro Pokémon por nombre 
    const resultados = allPokemons.filter(p => 
        p.name.toLowerCase().includes(nombre)
    );

    if(resultados.length === 0){
        // Si no hay resultados, muestro mensaje
        const mensaje = document.createElement("p");
        mensaje.textContent = `No se encontró ningún Pokémon con "${nombre}"`;
        mensaje.style.fontSize = "1.2rem";
        mensaje.style.textAlign = "center";
        mensaje.style.marginTop = "2rem";
        mensaje.style.color = "var(--clr-gray)";
        listaPokemon.appendChild(mensaje);
        return;
    }

    // Muestro resultados
    resultados.forEach(p => {
        listaPokemon.appendChild(createCard(p));
    });
}



//EVENTOS

botonesHeader.forEach(boton => {
    boton.addEventListener("click", (event) => {
        const tipo = event.currentTarget.id;
        filtrarPokemon(tipo);
    });
});

form.addEventListener("submit", (event) => {
    event.preventDefault(); 
    const query = input.value.trim().toLowerCase();
    buscarPokemon(query);
});




//CARGO LAS CARTAS
/* async function loadPokemon(){
    let card = ""
    for (let i = 1; i<=10; i++){
        let pokemon = await getPokemon(i)
        card += createCard (pokemon)
        console.log(pokemon.name)
    }
    let contenedor = document.getElementById("listaPokemon")
    contenedor.innerHTML= card
} */

// function createCard(poke){
//     const div = document.createElement("div");
//     div.classList.add("pokemon");
//     div.innerHTML = `
//         <p class="pokemon-id-back">#025</p>

//     <div class="pokemon-imagen">
//         <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png" alt="Pikachu">
//     </div>

//     <div class="pokemon-info">

//         <div class="nombre-contenedor">
//             <p class="pokemon-id">#025</p>
//             <h2 class="pokemon-nombre">Pikachu</h2>
//         </div>  

//             <div class="pokemon-tipos">
//                 <p class=" electric tipo">ELECTRIC</p>
//                 <p class="fighting tipo ">FIGHTING</p>
//             </div>

//             <div class="pokemon-stats">
//                 <p class="stat">4m</p>
//                 <p class="stat">60kg</p>
//             </div>
    
//     `
// }

/*
<div class="pokemon">
    <p class="pokemon-id-back">#025</p>

    <div class="pokemon-imagen">
        <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png" alt="Pikachu">
    </div>

    <div class="pokemon-info">

        <div class="nombre-contenedor">
            <p class="pokemon-id">#025</p>
            <h2 class="pokemon-nombre">Pikachu</h2>
        </div>  

            <div class="pokemon-tipos">
                <p class=" electric tipo">ELECTRIC</p>
                <p class="fighting tipo ">FIGHTING</p>
            </div>

            <div class="pokemon-stats">
                <p class="stat">4m</p>
                <p class="stat">60kg</p>
            </div>
        
    </div>

</div> 


*/