$(document).ready(function () {

//    jso_configure({
//        "html-voot-client": {
//            client_id: apiClientId,
//            authorization: authorizeEndpoint,
//            redirect_uri: redirectURI
//        }
//    });

    jso_configure({
        "fbgroups": {
            client_id: apiClientId,
            authorization: authorizeEndpoint,
            redirect_uri: redirectURI,
            presenttoken: presToken
        }
    });


    jso_ensureTokens({
        "fbgroups": apiScope
    });


    function renderGroupList(startIndex) {
        $.oajax({
            url: apiEndpoint + "/me/groups",
            //+
            //"?startIndex=" + startIndex +
            //"&count=" + maxPageLength +
            //"&sortBy=title",
            jso_provider: "fbgroups",
            jso_scopes: apiScope,
            jso_allowia: true,
            dataType: 'json',
            success: function (data) {
                $("#groupListTable").html($("#groupListTemplate").render(data));
                if(data.totalResults > maxPageLength) {
                    // show pagination stuff
                    var d = {numberList: []};
                    for(var i = 0; i < Math.ceil(data.totalResults / maxPageLength); i++) {
                        d.numberList.push({'pageNumber': i, activePage: Math.ceil(startIndex / maxPageLength)});
                    }
                    $("#groupListPagination").html($("#paginationTemplate").render(d));
                }
            }
        });
    }

    function renderMemberList(groupId, startIndex) {
        $.oajax({
//                url: apiEndpoint + "/people/@me/" + groupId +
//                "?startIndex=" + startIndex +
//                "&count=" + maxPageLength +
//                "&sortBy=displayName",
            url: apiEndpoint + "/" + groupId + "/members",
            jso_provider: "fbgroups",
            jso_scopes: apiScope,
            jso_allowia: true,
            dataType: 'json',
            success: function (data) {
                $("#memberListTable").html($("#memberListTemplate").render(data));
                if(data.totalResults > maxPageLength) {
                    // show pagination stuff
                    var d = {numberList: []};
                    for(var i = 0; i < Math.ceil(data.totalResults / maxPageLength); i++) {
                        d.numberList.push({'pageNumber': i, 'groupId': groupId, activePage: Math.ceil(startIndex / maxPageLength)});
                    }
                    $("#memberListPagination").html($("#paginationTemplate").render(d));
                } else {
                    $("#memberListPagination").empty();
                }
                $("#memberListModal").modal('show');
            }
        });
    }

    $(document).on('click', '#groupListTable a', function() {
        renderMemberList($(this).data('groupId'), 0);
    });

    $(document).on('click', '#groupListPagination a', function() {
        renderGroupList($(this).data('pageNumber')*maxPageLength);
    });

    $(document).on('click', '#memberListPagination a', function() {
        renderMemberList($(this).data('groupId'), $(this).data('pageNumber')*maxPageLength);
    });

    function initPage() {
        renderGroupList(0);
    }
    initPage();
});
