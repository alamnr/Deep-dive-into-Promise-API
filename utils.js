var fakeSlowNetwork;

(function(){
    var lsKey = 'fake-slow-network';
    var networkFakeDiv = document.querySelector('.network-fake');
    var checkbox = networkFakeDiv.querySelector('input');

    fakeSlowNetwork = Number(localStorage.getItem(lsKey)) || 0;

    networkFakeDiv.style.display = 'block';
    checkbox.checked = !!fakeSlowNetwork;

    checkbox.addEventListener('change',()=>{
        localStorage.setItem(lsKey,Number(checkbox.checked));
        location.reload();
    });
}());

function wait(ms){
    return new Promise(resolve=>{
        setTimeout(resolve,ms);
    });

}

function get(url){
    var fakeSlowNetwork = wait(3000*Math.random()*fakeSlowNetwork);

    var requestPromise = new Promise((resolve , reject)=>{
        var req = new XMLHttpRequest();
        req.open('get',url);

        req.onload = ()=>{
            if(req.status==200){
                resolve(req.response);
            }
            else{
                reject(Error(req.statusText));
            }
        };

        req.onerror = () =>{
            reject(Error('Network Error'));
        }

        req.send();

    });
    return Promise.all([fakeSlowNetwork,requestPromise]).then(function(results){
        return results[1];
    });
}

function getJson(url){
    return get(url).then(JSON.parse);
}

function getSync(url){
    var startTime = Date.now();
    var waitTime = 3000*Math.random()*fakeSlowNetwork;

    var req = new XMLHttpRequest();
    req.open('get',url,false);
    req.send();

    while(waitTime> Date.now()-startTime);
    
    if(req.status==200){
        return req.response;
    }
    else{
        throw Error(req.statusText || 'Request Failed');
    }
}

function getJsonSync(url){
    return JSON.parse(getSync(url));
}



var storyDiv = document.querySelector('.story');


function addHtmlToPage(content) {
    var div = document.createElement('div');
    div.innerHTML = content;
    storyDiv.appendChild(div);
  }
  
  function addTextToPage(content) {
    var p = document.createElement('p');
    p.textContent = content;
    storyDiv.appendChild(p);
  }