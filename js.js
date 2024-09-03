//pegar os valores
//usar api
//https://www.youtube.com/watch?v=721nPAwTc_Y


//melhorar css
//puxar todas as moedas com o xml
//site da api: https://docs.awesomeapi.com.br/api-de-moedas

paraConverter = document.querySelector('#paraConversao')
convertido = document.querySelector('#convertido')
tipoDaMoedaUm = document.querySelector('#tipoDaMoedaUm')
tipoDaMoedaDois = document.querySelector('#tipoDaMoedaDois')
semCombinacao = document.querySelector('#semCombinacao')
reverterMoeda = document.querySelector('.btnReverter').addEventListener('click', () => {
    let aux = tipoDaMoedaUm.value
    tipoDaMoedaUm.value=tipoDaMoedaDois.value
    tipoDaMoedaDois.value=aux
    aux = paraConverter.value
    
})

// reverterMoeda. eve
async function conversorDeMoedas(moedaUm, moedaDois) {
    try {
        response = await fetch(`https://economia.awesomeapi.com.br/json/last/${moedaUm}-${moedaDois}`)
        dados = await response.json()
        
        const chaveConversao = `${moedaUm}${moedaDois}`;
        const taxaConversao = dados[chaveConversao].bid;
        valorFormatado = parseFloat(taxaConversao * paraConverter.value).toFixed(2).replace(".", ",")
        convertido.value = valorFormatado
    }
    catch (erro) {
        console.error('Erro ao obter as cotações:', erro);
    }
}

async function paisAbreviadoAPI() {
    const response = await fetch('https://economia.awesomeapi.com.br/xml/available/uniq')
    const str = await response.text() // Converte a resposta para texto
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(str, "text/xml");

    const items = xmlDoc.documentElement.childNodes
    const paisNome = Array.from(items)
    .filter(tag => tag.nodeType === 1) // Filtra apenas os nós do tipo Element
    .map(tag => tag.nodeName); // Mapeia para um array de nomes de nó
    //  console.log(paisNome)
    return paisNome
}

async function paisNomeAPI() {
    
    const response = await fetch('https://economia.awesomeapi.com.br/xml/available/uniq')
    const str = await response.text() // Converte a resposta para texto
    
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(str, "text/xml");
    
    const items = xmlDoc.documentElement.childNodes
    const paisNome = Array.from(items)
    .filter(tag => tag.nodeType === 1) // Filtra apenas os nós do tipo Element
    .map(tag => tag.textContent);
    
    return paisNome
}

async function verificaCombinacao() {
    try {
        if (tipoDaMoedaUm.value === tipoDaMoedaDois.value) {
        semCombinacao.style.visibility = "hidden"
        return convertido.value = paraConverter.value   
        }
        fetch('https://economia.awesomeapi.com.br/xml/available')
        .then(response => response.text()) // Converte a resposta para texto
        .then(str => {
                const parser = new DOMParser();
                const xmlDoc = parser.parseFromString(str, "text/xml");
                
                const items = xmlDoc.documentElement.childNodes
                modedasConcatenasdas = tipoDaMoedaUm.value + "-" + tipoDaMoedaDois.value
                
                const nodeNames = Array.from(items)
                .filter(tag => tag.nodeType === 1) // Filtra apenas os nós do tipo Element
                .map(tag => tag.nodeName); // Mapeia para um array de nomes de nó
                
                // Usando includes para verificar se o array de nomes contém o valor desejado
                if (nodeNames.includes(modedasConcatenasdas)) {
                    // console.log(`Encontrado: ${modedasConcatenasdas}`);
                    semCombinacao.style.visibility = "hidden"
                    conversorDeMoedas(tipoDaMoedaUm.value, tipoDaMoedaDois.value)
                } else {
                    // console.log(`Não Encontrado: ${modedasConcatenasdas}`);
                    semCombinacao.style.visibility = "visible"
                    semCombinacao.innerHTML = `${tipoDaMoedaUm.value} E ${tipoDaMoedaDois.value} É UMA COMBINAÇÃO INVÁLIDA!`
                }
            })

    } catch (error) {
        console.error('Erro ao buscar ou processar dados:', error);
        return [];
    }

}

async function adicionaMoedas() {
    try {
        // console.log("Frffrr")
        const paisAbreviado = await paisAbreviadoAPI()
        const paisNome = await paisNomeAPI()
        console.log(paisAbreviado[0]+" - "+paisNome[0])
        console.log(paisNome[0]+" - "+paisAbreviado[0])
        for (const i in paisNome) {
            if (paisNome.hasOwnProperty(i)) {
                const option = document.createElement('option')
                option.value = paisAbreviado[i]//+" - "+ paisNome[i]
                option.text = paisAbreviado[i]+" - "+ paisNome[i]
                tipoDaMoedaUm.appendChild(option)

                const option2 = document.createElement('option')
                option2.value = paisAbreviado[i]//+" - "+ paisNome[i]
                option2.text = paisAbreviado[i]+" - "+ paisNome[i]
                tipoDaMoedaDois.appendChild(option2)
            }
        }
    } catch (erro) {
        console.error('Erro adiconar moedas:', erro);
    }

}

adicionaMoedas()
setInterval(() => {

    verificaCombinacao()
}, 200)