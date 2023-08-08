let userTab=document.querySelector('[data-userWeather]');
let searchTab=document.querySelector('[data-searchWeather]');
let userContainer=document.querySelector('.weather-container')
let grantAccessContainer=document.querySelector('.grant-location-container');
let searchForm=document.querySelector('[data-searchFrom]');
let loadingScreen=document.querySelector('.loading-container');
let userInfoContainer=document.querySelector('.user-info-container');

//initially variable need??
let currentTab=userTab;
const API_KEY="1f935b28c0b7ef87241c6408066e3369";
currentTab.classList.add('current-tab');

//ek kaam pending hain jo hum last me karenge 
getfromSessionStorage();

function switchTab(clickedTab)
{
    if(clickedTab!=currentTab)
    {
        currentTab.classList.remove('current-tab');
        currentTab=clickedTab;
        currentTab.classList.add('current-tab');

        if(!searchForm.classList.contains('active'))
        {
            //kya search form wala container is invisible,if yes then make it visible
            grantAccessContainer.classList.remove('active');
           userInfoContainer.classList.remove('active');
            searchForm.classList.add('active');
        }
        else
        {
            //main pehlle search tab pe tha ,ab mujhe weather tab visible karna hain
            searchForm.classList.remove('active');
           userInfoContainer.classList.remove('active');
            //ab me weather tab me aa gaya hu ,toh weather bhe display karna padega .so lets check local storage first for coordinates ,if we have saved them there 
            getfromSessionStorage();
        }

    }
}
userTab.addEventListener('click',()=>{
    //pass clicked tab as input parameter
    switchTab(userTab);
});

searchTab.addEventListener('click',()=>{
    //pass clicked tab as input parameter
    switchTab(searchTab);
});

//check if the coordinates are already present in session storage 
function getfromSessionStorage()
{
    //yeh line samjh nahe aaye 
    let localCoordinates=sessionStorage.getItem("user-coordinates");
    if(!localCoordinates)
    {
        //agar local coordinates nahe mile 
        grantAccessContainer.classList.add('active');
    }
    else
    {
        const coordinates=JSON.parse(localCoordinates);
        fetchUserWeatherInfo(coordinates);
    }

}
async function fetchUserWeatherInfo(coordinates)
{
    const { lat, lon } = coordinates;
    //make grantContainer invisible
    grantAccessContainer.classList.remove('active');
    //make laoding Container visible
    loadingScreen.classList.add('active');

    //API call
    try{
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);

        const data=await response.json();

        loadingScreen.classList.remove('active');
        userInfoContainer.classList.add('active');

        renderWeatherInfo(data);
    
    }
    catch(err)
    {
        // loadingScreen.classList.remove('active');
        console.log("hey1");
    }
}

function renderWeatherInfo(weatherInfo)
{
    const cityName=document.querySelector('[data-cityName]');
    const countryIcon=document.querySelector('[data-countryIcon]');
    const desc=document.querySelector('[data-WeatherDesc]');
    const weatherIcon=document.querySelector('[data-WeatherIcon]');
    const temp=document.querySelector('[data-temp]');
    const windspeed=document.querySelector('[data-windspeed]');
    const humidity=document.querySelector('[data-humidity]');
    const cloudiness=document.querySelector('[data-cloudiness]');

    //fetch values from weatherInfo object and put it in UI element
    cityName.innerText=weatherInfo?.name;
    countryIcon.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
    desc.innerText=weatherInfo?.weather?.[0]?.description;
    weatherIcon.src = `http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
    temp.innerText=`${weatherInfo?.main?.temp} °C`;
    windspeed.innerText=`${weatherInfo?.wind?.speed} m/s`;
    humidity.innerText=`${weatherInfo?.main?.humidity} %`;
    cloudiness.innerText=`${weatherInfo?.clouds?.all} %`;
}
const grantAccesButton=document.querySelector('[data-grantAcess]');
grantAccesButton.addEventListener('click',getLocation);

function getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(showPosition);
    } 
    else {
      alert("Geolocation is not supported by this browser.");
    }
  }
  
  function showPosition(position) {

    const usercoordinates={
        lat: position.coords.latitude,
        lon: position.coords.longitude
    }
    sessionStorage.setItem("user-coordinates",JSON.stringify(usercoordinates));
    fetchUserWeatherInfo(usercoordinates)
   
  }

  const searchInput=document.querySelector('[data-searchInput]');
  searchForm.addEventListener('submit',(e) =>
  {
      e.preventDefault();
      let cityName=searchInput.value;
      if(cityName ==="")
      return;
      else{
          fetchSearchWeatherInfo(cityName);
        //   searchInput.value = "";
      }

  });
  async function fetchSearchWeatherInfo(city)
  {
      loadingScreen.classList.add('active');
      userInfoContainer.classList.remove('active');
      grantAccessContainer.classList.remove('active');

      try{

        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);


        const data=await response.json();
        loadingScreen.classList.remove('active');
        userInfoContainer.classList.add('active');
        renderWeatherInfo(data);

      }
      catch(err)
      {
          console.log("hey2");
      }
  }