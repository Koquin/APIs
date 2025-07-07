document.getElementById('obter-piada').addEventListener('click', function () {
    fetch('https://v2.jokeapi.dev/joke/Any?')
        .then(response => response.json())
        .then(data => {
            const saida = document.getElementById('piada-saida');
            if (data.type === 'single') {
                saida.textContent = `"${data.joke}"`;
            } else if (data.type === 'twopart') {
                saida.innerHTML = `<strong>${data.setup}</strong><br>${data.delivery}`;
            } else {
                saida.textContent = 'Piada inesperada... 🤔';
            }
        })
        .catch(error => {
            console.error('Erro:', error);
            document.getElementById('piada-saida').textContent = 'Não foi possível obter a piada.';
        });
});


document.getElementById('obter-pokemon').addEventListener('click', function () {
    const randomId = Math.floor(Math.random() * 1010) + 1;
    fetch(`https://pokeapi.co/api/v2/pokemon/${randomId}`)
        .then(response => response.json())
        .then(data => {
            document.getElementById('pokemon-revelado').style.display = 'none';
            const silhuetaContainer = document.getElementById('pokemon-silhueta');
            silhuetaContainer.style.display = 'block';

            const silhuetaImg = document.getElementById('silhueta-img');
            silhuetaImg.src = data.sprites.front_default;

            document.getElementById('dica').textContent = `Dica: Tipo(s) - ${data.types.map(t => t.type.name).join(', ')}`;

            document.getElementById('verificar-palpite').onclick = function () {
                const palpite = document.getElementById('palpite').value.toLowerCase();
                const pokemonNome = data.name.toLowerCase();
                const resultado = document.getElementById('resultado-palpite');

                if (palpite === pokemonNome) {
                    resultado.textContent = "✅ Acertou!";
                } else {
                    resultado.textContent = "❌ Errou! Era " + data.name.toUpperCase();
                }

                document.getElementById('pokemon-nome').textContent = data.name.toUpperCase();
                document.getElementById('pokemon-img').src = data.sprites.front_default;
                document.getElementById('pokemon-tipo').innerHTML = `<strong>Tipo:</strong> ${data.types.map(t => t.type.name).join(', ')}`;

                silhuetaContainer.style.display = 'none';
                document.getElementById('pokemon-revelado').style.display = 'block';
            };
        })
        .catch(error => {
            console.error('Erro:', error);
            document.getElementById('pokemon-saida').textContent = 'Erro ao carregar Pokémon.';
        });
});

const githubTokenInput = document.getElementById('githubToken');
const getGithubUserButton = document.getElementById('obter-github-user');
const githubUserSaida = document.getElementById('github-user-saida');

getGithubUserButton.addEventListener('click', async () => {
    const token = githubTokenInput.value.trim();

    if (!token) {
        githubUserSaida.textContent = 'ERRO: Por favor, insira um token GitHub.';
        githubUserSaida.classList.add('error');
        githubUserSaida.classList.remove('success');
        return;
    }

    githubUserSaida.textContent = 'Carregando...';
    githubUserSaida.classList.remove('error', 'success');

    try {
        const response = await fetch('https://api.github.com/user', {
            method: 'GET',
            headers: {
                'Accept': 'application/vnd.github+json',
                'Authorization': `Bearer ${token}`,
                'X-GitHub-Api-Version': '2022-11-28'
            }
        });

        const data = await response.json();

        if (response.ok) {
            const user_info = {
                login: data.login,
                id: data.id,
                name: data.name,
                public_repos: data.public_repos,
                followers: data.followers,
                following: data.following,
                avatar_url: data.avatar_url,
                html_url: data.html_url
            };
            githubUserSaida.textContent = JSON.stringify(user_info, null, 2);
            githubUserSaida.classList.add('success');
            githubUserSaida.classList.remove('error');
        } else {
            githubUserSaida.textContent = `ERRO: ${data.message || 'Requisição falhou'}`;
            githubUserSaida.classList.add('error');
            githubUserSaida.classList.remove('success');
        }
    } catch (error) {
        console.error('Erro na requisição GitHub:', error);
        githubUserSaida.textContent = 'ERRO: Não foi possível conectar à API do GitHub.';
        githubUserSaida.classList.add('error');
        githubUserSaida.classList.remove('success');
    }
});


const NUMVERIFY_API_KEY = "fa43fb5dc3def3db0e403157e753de8f";

const phoneNumberInput = document.getElementById('phoneNumber');
const validatePhoneButton = document.getElementById('validar-telefone');
const numverifySaida = document.getElementById('numverify-saida');

validatePhoneButton.addEventListener('click', async () => {
    const phoneNumber = phoneNumberInput.value.trim();

    if (!phoneNumber) {
        numverifySaida.textContent = 'ERRO: Por favor, insira um número de telefone.';
        numverifySaida.classList.add('error');
        numverifySaida.classList.remove('success');
        return;
    }

    if (!NUMVERIFY_API_KEY) {
        numverifySaida.textContent = 'ERRO: A chave da API NumVerify não foi configurada no código JavaScript.';
        numverifySaida.classList.add('error');
        numverifySaida.classList.remove('success');
        return;
    }

    numverifySaida.textContent = 'Carregando...';
    numverifySaida.classList.remove('error', 'success');

    try {
        const url = `https://apilayer.net/api/validate?access_key=${NUMVERIFY_API_KEY}&number=${encodeURIComponent(phoneNumber)}`;
        console.log(url);

        const response = await fetch(url);
        const data = await response.json();
        console.log(data);
        console.log(data.valid);

        if (data.valid) {
            const phone_info = {
                valid: data.valid,
                number: data.number,
                local_format: data.local_format,
                international_format: data.international_format,
                country_prefix: data.country_prefix,
                country_code: data.country_code,
                country_name: data.country_name,
                carrier: data.carrier,
                line_type: data.line_type
            };
            numverifySaida.textContent = JSON.stringify(phone_info, null, 2);
            numverifySaida.classList.add('success');
            numverifySaida.classList.remove('error');
        } else {
            const errorMessage = data.error ? `${data.error.code}: ${data.error.type} - ${data.error.info}` : 'Resposta inválida da API.';
            numverifySaida.textContent = `ERRO: ${errorMessage}`;
            numverifySaida.classList.add('error');
            numverifySaida.classList.remove('success');
        }
    } catch (error) {
        console.error('Erro na requisição NumVerify:', error);
        numverifySaida.textContent = 'ERRO: Não foi possível conectar à API NumVerify.';
        numverifySaida.classList.add('error');
        numverifySaida.classList.remove('success');
    }
});