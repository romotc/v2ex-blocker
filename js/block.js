(function() {
    var AVATAR_UID_REGEX = /^http:\/\/cdn\.v2ex\.com\/avatar\/[a-zA-z0-9]{4}\/[a-zA-z0-9]{4}\/(\d+)_large\.png\?m\=(\d*)$/;
    var cache;

    var UserCache = function () {
        this._cache = localStorage['userInfo'];
        
        if(this._cache === undefined) {
            this._cache = {};
        }else{
            this._cache = JSON.parse(this._cache);
        }
    };

    UserCache.prototype.getUserIDFromUsername = function(username, callback) {
        var self = this;

        if(this._cache[username] && this._cache[username].id) {
            return callback(this._cache[username].id);
        }

        // get user information from API
        $.getJSON('http://www.v2ex.com/api/members/show.json?username=' + username, function(content) {
            if(content === "notfound") {
                console.warn(username + " not found from API, please check about it.");
                return;
            }

            self._cache[username] = content;
            self.saveCache();

            callback(self._cache[username].id);
        });
    };

    UserCache.prototype.saveCache = function() {
        localStorage["userInfo"] = JSON.stringify(this._cache);
    };

    function getUIDFromReply(reply, callback) {
        // try to get uid from avatar src
        var avatar_src = $('.avatar', reply).attr('src'), 
            match_result = AVATAR_UID_REGEX.exec(avatar_src), 
            reply_user = $('strong a[href^="/member/"]', reply), 
            username = reply_user.text().trim();
        if(match_result) {
            return callback(parseInt(match_result[1], 10));
        }
        // try to get uid from localStorage
        cache.getUserIDFromUsername(username, callback);
    }

    function cleanReplyList() {
        var replies = $('div[id^="r_"]');
        
        replies.each(function(_, reply) {
            getUIDFromReply(reply, function(uid) {
                if(uid >= 10000) {
                    hideReply(reply);
                }
            });
        });
    }

    function hideReply(reply) {
        $(reply).hide();
    }
    
    function startCleanPage() {
        cache = new UserCache();
        cleanReplyList();
    }

    startCleanPage();
})();
