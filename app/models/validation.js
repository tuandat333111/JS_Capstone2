function validation(){
    this.checkEmpty=function(value,spanid,message){
        if(value===""||value===0){
            getEle(spanid).style.display="block";
            getEle(spanid).innerHTML=message;
            return false;
        }
        else{
            getEle(spanid).style.display="none";
            getEle(spanid).innerHTML="";
            return true;
        }
    }
    this.checkChosen=function(selectId,spanId,message){
        if(getEle(selectId).selectedIndex!=0){
            getEle(spanId).innerHTML="";
            getEle(spanId).style.display="none";
            return true;
        }
        else{
            getEle(spanId).innerHTML=message;
            getEle(spanId).style.display="block";
            return false;
        }
        
    }
}