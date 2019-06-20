
var AWS = require('aws-sdk');
var identityServiceProvider = new AWS.CognitoIdentityServiceProvider();
var config = require('../../config.json');

exports.getUserFromAuthoriser = function(context){
    if (context.authorizer){
        return {
            "email": context["authorizer"]["claims"]["email"],
            "name": context["authorizer"]["claims"]["given_name"],
            "surname": context["authorizer"]["claims"]["family_name"],
            "nickname": context["authorizer"]["claims"]["nickname"],
            "cognito_name": context["authorizer"]["claims"]["sub"]
        };
    } else {
        return false;
    }
};

exports.getUsersList = function(){
    var params = {
        UserPoolId: config.cognito.COGNITO_USER_POOL_ID
    }
    var users = identityServiceProvider.listUsers(params);

    var result = [];

    if (typeof users.Users !== 'undefined'){
        for (var user in users.Users){
            var email = "", name = "", surname = "";
            
            for (var attr in user.Attributes){
                switch(attr.Name) {
                    case "email":
                        email = attr["Value"];  
                        break;
                    case "given_name":
                        name = attr["Value"];
                        break;
                    case "family_name":
                        surname = attr["Value"];
                        break;
                    default:
                      
                  } 

                result.append({
                    "email": email,
                    "name": name,
                    "surname": surname,
                });
            }
        }

        return result;
    } else {
        return false;
    }
};

exports.findUserFromUUID = function(uuid){
    var params = {
        UserPoolId: config.cognito.COGNITO_USER_POOL_ID,
        Filter: 'username = ' + uuid
    }
    var users = identityServiceProvider(params);

    if (users){
        var email = "";
        var name = "";
        var surname = "";
        var nickname = "";
        var cognito_name = "";

        for (var attr in users["Users"][0]["Attributes"]) {
            if (attr["Name"] == "email")
                email = attr["Value"];
            if (attr["Name"] == "given_name")
                name = attr["Value"];
            if (attr["Name"] == "family_name")
                surname = attr["Value"];
            if (attr["Name"] == "sub")
                cognito_name = attr["Value"];
            if (attr["Name"] == "nickname")
                nickname = attr["Value"];
        };
        
        return {
            "email": email,
            "name": name,
            "surname": surname,
            "nickname": nickname,
            "cognito_name": cognito_name
        };
    } else {
        return false;
    }
};
