const puppeteer = require('puppeteer')
const fs = require('fs')

async function run(){
    const browser = await puppeteer.launch()
    const page = await browser.newPage()
    await page.goto(`https://pokemondb.net/pokedex/all`)
    // await page.screenshot({
    //       path: 'screenshot.png',
    //       fullPage: true,
    //     })
    const data = await page.evaluate(() => {
        const POKEMONS = document.querySelectorAll('tbody > tr')
       
        let pokemonArray = []
        POKEMONS.forEach((pokemon,index) =>{

            if(index>=0 ){
                let types =[]
                pokemon.querySelectorAll('.type-icon').forEach(type=>types.push(type.textContent))
                pokemonArray.push({
                    id:index,
                    name:pokemon.querySelector('.ent-name').textContent,
                    icon:pokemon.querySelector('.img-fixed').getAttribute("data-src") || "",
                    types,
                    total:pokemon.querySelector('.cell-total').textContent,
                    HP:pokemon.querySelectorAll('.cell-num')[0].textContent,
                    Attack:pokemon.querySelectorAll('.cell-num')[1].textContent,
                    Defense:pokemon.querySelectorAll('.cell-num')[2].textContent,
                    SpAttk:pokemon.querySelectorAll('.cell-num')[3].textContent,
                    SpDef:pokemon.querySelectorAll('.cell-num')[4].textContent,
                    Speed:pokemon.querySelectorAll('.cell-num')[5].textContent
                })
            }
           

            console.log(pokemonArray)
        })
        return pokemonArray
    })
    console.log(data)
    fs.writeFile('data.js', `export default ${JSON.stringify(data)}`, () => {
        console.log('data writed')
      })
    console.log("finished")
    await browser.close();
}

run()