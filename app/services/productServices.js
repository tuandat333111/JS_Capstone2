function productServices(){
    var url=`https://638ebb8a4ddca317d7e4e4dd.mockapi.io/api`;
    this.callAPI=function(uri,method,data){
        return axios({
            url:`${url}/${uri}`,
            method: method,
            data: data,
        });
    }

    
    
}

