
//console.log(getPokemon(10).name)
//buscar pokemon
async function getPokemon(id){
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
    if (!response.ok){
        throw new Error ("No se encuentra el pokemon");
    }
    const data = await response.json()
    return data
}

function createCard(pokemon){
    return `
    <div class="card">

        <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}">
        <h2>${pokemon.name}</h2>
        <p>${pokemon.height}</p>
        <p>${pokemon.types.map(t=>t.type.name).join(", ")}</p>

    </div>
    `
}

async function loadPokemon(){
    let card = ""
    for (let i = 1; i<=10; i++){
        let pokemon = await getPokemon(i)
        card += createCard (pokemon)
        console.log(pokemon.name)
    }
    let contenedor = document.getElementById("listaPokemon")
    //contenedor.innerHTML= card
}

async function loadPokemonV3() {
    try{
        const promises = [];
        for (let i = 1; i <= 10; i++) {
            if (i == 4)
                promises.push(getPokemon("X"))
            else promises.push(getPokemon(i))
        }
        const pokemons = await Promise.allSettled(promises)
        console.log(pokemons)

        const succesful = pokemons
        .filter( r => r.status === "fulfilled")
        .map(r => r.value)

        console.log(succesful)

        const card = succesful.map(p => createCard(p)).join("")

        console.log(card)
        
        let contenedor = document.getElementById("listaPokemon")
        //contenedor.innerHTML= card
            

    }catch(error){

    }
    
}

loadPokemonV3();





