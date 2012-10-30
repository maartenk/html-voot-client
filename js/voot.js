$(document).ready(function () {

    var apiScope = ["read"];

    jso_configure({
        "html-voot-client": {
            client_id: apiClientId,
            authorization: authorizeEndpoint
        }
    });
    jso_ensureTokens({
        "html-voot-client": apiScope
    });

    function renderGroupList(pageNumber) {
        $.oajax({
            url: apiEndpoint + "/groups/@me?startIndex=" + pageNumber + "&count=" + maxPageLength,
            jso_provider: "html-voot-client",
            jso_scopes: apiScope,
            jso_allowia: true,
            dataType: 'json',
            success: function (data) {
                $("#groupListTable").html($("#groupListTemplate").render(data));
                if(data.totalResults > maxPageLength) {
                    // show pagination stuff
                    var d = { numberList: [] };
                    for(var i = 0; i < Math.ceil(data.totalResults / maxPageLength); i++) {
                        d.numberList.push({'pageNumber': i});
                    }
                    $("#groupListPagination").html($("#paginationTemplate").render(d));
                }
            }
        });
    }

    function renderMemberList(groupId, pageNumber) {
        $.oajax({
            url: apiEndpoint + "/people/@me/" + groupId + "?startIndex=" + pageNumber + "&count=" + maxPageLength,
            jso_provider: "html-voot-client",
            jso_scopes: apiScope,
            jso_allowia: true,
            dataType: 'json',
            success: function (data) {
                $("#memberListTable").html($("#memberListTemplate").render(data));
                if(data.totalResults > maxPageLength) {
                    // show pagination stuff
                    var d = { numberList: [] };
                    for(var i = 0; i < Math.ceil(data.totalResults / maxPageLength); i++) {
                        d.numberList.push({'pageNumber': i, 'groupId': groupId});
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
