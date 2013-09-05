(function() {
    var AVATAR_UID_REGEX = /^http:\/\/cdn\.v2ex\.com\/avatar\/[a-zA-z0-9]{4}\/[a-zA-z0-9]{4}\/(\d+)_large\.png\?m\=(\d*)$/;
    var localCache;

    function getUIDFromReply(reply, callback) {
        // try to get uid from avatar src
        var avatar_src = $('.avatar', reply).attr('src'), \
            match_result = AVATAR_UID_REGEX.exec(avatar_src), \
            reply_user = $('strong a[href^="/member/"]', reply), \
            username = reply_user.text().trim();
        if(match_result) {
            return callback(parseInt(match_result[1], 10));
        }
        // try to get uid from localStorage
        if(localCache[username] && localCache[username].id) {
            return callback(localCache[username].id);
        }
        // get user information from API
        $.getJSON('http://www.v2ex.com/api/members/show.json?username=' + username, function(content) {
            localCache[username] = content;
            if(localCache[username].status === "notfound") {
                console.warn(username + " not found from API, please check it.");
                return;
            }
            callback(localCache[username]);
        });
    }

    function cleanReplyList() {
        var replies = $('div[id^="r_"]');
        
        replies.each(function(_, reply) {
        });
    }

    function loadLocalCache() {
        var cache = localStorage['userInfo'];
        if(cache === undefined) {
            cache = {}
        }else{
            cache = JSON.parse(cache);
        }

        return cache;
    }
    
    function saveLocalCache() {}

    function startCleanPage() {
        localCache = loadLocalCache();
    }
})();
