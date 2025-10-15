async function loadPokemonV3() {
    
    try{
        const promises = [];
        for (let i = 1; i <= 10; i++) {
            promises.push(getPokemon(i))
        }
        const pokemons = await Promise.allSettled(promises)
        console.log(pokemons)

        const succesful = pokemon
        .filter( r => r.status === "fulfilled")
        .map(r => r.value)

        const cards = succesful.map(p => createCard(p).join(""))
        let contenedor = document.getElementById("listaPokemon")
        contenedor.innerHTML= cards
            

    }catch(error){

    }
    
}

/* async function loadPokemonV3() {
    try{
        const promises = [];
        for (let i = 1; i <= 10; i++) {
            if (i== 4)
                promises.push(getPokemon("x"))
            else promises.push(getPokemon(i))
        }
        const pokemons = await Promise.allSettled(promises)
        console.log(pokemons)

            

    }catch(error){

    }
    
} */

loadPokemonV3()

async function loadPokemonV2() {
    try{
        const promises = [];
        for (let i = 1; i <= 10; i++) {
            promises.push(getPokemon(i))
        }
        const pokemons = await Promise.allSettled(promises)

        const card = pokemons.map(p => createCard(p)).join("");
        let contenedor = document.getElementById("listaPokemon")
        contenedor.innerHTML= card
            

    }catch(error){

    }
    
}

//USAR CREATE CARD CON XSS EN INNERHTML
