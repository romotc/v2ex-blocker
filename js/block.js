(function() {
    var AVATAR_UID_REGEX = /^http:\/\/cdn\.v2ex\.com\/avatar\/[a-zA-z0-9]{4}\/[a-zA-z0-9]{4}\/(\d+)_large\.png\?m\=(\d*)$/, 
        HOT_TOPIC_UID_REGEX = /cell from_(\d+) hot_t_(.*)/, 
        cache;

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

    function getUIDFromElement(element, callback) {
        // try to get uid from avatar src
        var avatar_src = $('.avatar', element).attr('src'), 
            match_result = AVATAR_UID_REGEX.exec(avatar_src), 
            reply_user = $('strong a[href^="/member/"]', element), 
            username = reply_user[0].innerText.trim();
        if(match_result) {
            return callback(parseInt(match_result[1], 10));
        }
        // try to get uid from localStorage
        cache.getUserIDFromUsername(username, callback);
    }

    function cleanList(list) {
        list.each(function(_, element) {
            getUIDFromElement(element, function(uid) {
                handleUID(uid, element);
            });
        });
    }

    function handleUID(uid, element) {
        if(uid >= 10000) {
            hideElement(element);
        }
    }

    function cleanReplyList() {
        cleanList($('div[id^="r_"]'));
        // TODO: change the class of last reply from `cell` to `inner` for removing border-bottom
    }

    function cleanTopicList() {
        cleanList($('#Main > .box > .cell.item'));
    }

    function cleanTopHot() {
        var hot_topics = $('#TopicsHot .cell[class*="from_"]');

        hot_topics.each(function(_, topic) {
            var regex_result = HOT_TOPIC_UID_REGEX.exec(topic.className);

            if(regex_result) {
                return handleUID(parseInt(regex_result[1], 10), topic);
            }
        });
    }

    function hideElement(element) {
        $(element).remove();
    }
    
    function startCleanPage() {
        cache = new UserCache();

        cleanReplyList();
        cleanTopicList();
        cleanTopHot();
    }

    startCleanPage();
})();
