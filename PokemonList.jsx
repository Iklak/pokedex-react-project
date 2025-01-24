import { useEffect,useState } from "react"
import axios from 'axios';
import Pokemon from "../Pokemon/Pokemon";
import './PokemonList.css'


function PokemonList(){

    const [pokemonList,setPokemonList]=useState([]);
    const [isLoading,setIsLoading]=useState(true);
    const [pokedexurl,setPokedexurl]=useState('https://pokeapi.co/api/v2/pokemon')
    const[nextUrl,setNexturl]=useState('')
    const[prevUrl,setPrevUrl]=useState('')

    async function downloadPokemons() {
        setIsLoading(true);
        const response=await axios.get(pokedexurl);
        const PokemonResult=response.data.results;

        setNexturl(response.data.next);
        setPrevUrl(response.data.previous)

        const PokemonResultPromises=PokemonResult.map((pokemon)=>axios.get(pokemon.url));
        const PokemonData=await axios.all(PokemonResultPromises);
        console.log(PokemonData)
       const res=PokemonData.map((pokedata)=>{
        const pokemon=pokedata.data;

        return{
            id:pokemon.id,
            name:pokemon.name,
            image:(pokemon.sprites.other)?pokemon.sprites.other.dream_world.front_default:pokemon.sprites.front_shiny,
            types:pokemon.types
        }

       })
       console.log(res);
       setPokemonList(res);
        setIsLoading(false);
        
    }
    useEffect(()=>{
        downloadPokemons();

    },[pokedexurl])
return(
<div className="pokemon-list-wrapper">
<div>Pokemon List</div>
<div className="pokemon-container">
{(isLoading)?'Loading....':
 
 pokemonList.map((p)=><Pokemon name={p.name} image={p.image} ></Pokemon>)
}
</div>

<div className="controls">
    <button disabled={prevUrl==null} onClick={()=>setPokedexurl(prevUrl)}>Prev</button>
    <button disabled={nextUrl==null} onClick={()=>setPokedexurl( nextUrl)}>Next</button>
</div>
</div>
)
}

export default PokemonList