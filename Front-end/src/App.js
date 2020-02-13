import React ,{useState, useEffect } from 'react';

import api from './services/api';
import './global.css';
import './App.css';
import './Sibebar.css';
import './Main.css';



function App() {

const [devs,setDevs] = useState([]);

const [github_username, setGitHubUsername] = useState('');
const [techs, setTechs] = useState('');
const [latitude, setLatitude] = useState('');
const [longitude, setlongitude] = useState('');

	useEffect(()=>{
		navigator.geolocation.getCurrentPosition(
		(position)=>{

			const { latitude, longitude}= position.coords;
			setLatitude(latitude);
			setlongitude(longitude);
		},(err)=>{

		},
		{
			timeout:30000,
		}
		);
	},[]);

	useEffect(()=>{
		async function loadDevs(){

			const response = await api.get('/devs');

			setDevs(response.data);
		}
		loadDevs();
	},[]);


	async function handleAddDev(e){
		e.preventDefault();

		const response = await api.post('/devs', {
		github_username,
		techs,
		latitude,
		longitude,
		})
		setGitHubUsername('');
		setTechs('');

		setDevs([...devs, response.data]);

	}

	return ( 

	<div id="app"> 
		<aside> 
			<strong>Cadastrar</strong>
				<form onSubmit={handleAddDev}>

					<div className="input-block">
						<label htmlFor="github_username">Usuário do GitHub</label>
						<input name="github_username" id="username_github" required 
						value={github_username}
						onChange={e=>setGitHubUsername(e.target.value)} />
					</div>

					<div className="input-block">
						<label htmlFor="techs">Tecnologias</label>
						<input name="techs" id="techs" required 
						value={techs}
						onChange={e=>setTechs(e.target.value)}
						/>
					</div>

					<div className="input-group">
						<div className="input-block">
							<label htmlFor="techs">Latitude</label>
							<input 
								type="number" 
								name="Latitude" 
								id="Latitude" 
								required 
								value = {latitude} 
								onChange={e => setLatitude(e.target.value)} 
							/>
							</div>
						<div className="input-block">
							<label htmlFor="techs">Longitude</label>
							<input type="number" name="Longitude" id="Longitude" required value = {longitude} onChange={e => setlongitude(e.target.value)} />
							</div>
					</div>
						<button type="submit">Salvar</button>
				</form>

			</aside> 
	<main> 
		<ul>
		{devs.map(dev=> (
			<li key={dev._id} className="dev-item">

				<header>
					<img src={dev.avatar_url} alt={dev.name} />
					<div  className="user-info">
						<strong>{dev.name}</strong>
						
						<span>{dev.techs.join(', ')}</span> 
					</div>
				</header>
				<p>{dev.bio}</p>

				<a href={`https://gitlab.com/${dev.github_username}`}>Acessar Perfil no Github</a>

			</li>

		))}

		</ul>

	</main> 

	</div>
	);
}

export default App;
