
function check(){
    console.log("middleware fired")
}


exports.oauthMiddleware = [
    function check(req,res,next){
        console.log("middleware fired")
        next()
    }
 ]
 