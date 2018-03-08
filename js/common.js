$(document).ready(function () {
    $.ajax({
        url: 'http://localhost:3000/',
        headers: {
            'Access-Control-Allow-Credentials': true,
        },
        dataType: "json",
        success: function (data, textStatus) {
            // console.log(data);
            for (let i = 0; i < data.length; i++) {

                let curObj = data[i];

                $('main').append('<article></article>');
                $('article:last-of-type')
                    .append('<h2>  ' + curObj.name + ' </h2>')
                    .append('<p> ' + curObj.quote + ' </p>')
                    .append('<button class="update">update</button>')
                    .append('<button class="delete">delete</button>')
                    .attr('id', curObj._id);
            }
        }

    });

    //add article-----------------------------------------------------------------

    $("#addArticle").on("click", function () {

        $(this).after('  <form action="/quotes" method="POST" class="add-form">\n' +
            '    <input type="text" placeholder="name" name="name">\n' +
            '    <input type="text" placeholder="quote" name="quote">\n' +
            '    <button type="submit">Submit</button>\n' +
            '  </form>');

        $("button[type$='submit']").on("click", function (e) {
            e.preventDefault();
            $("button[type$='submit']").prop('disabled', true);

            let name = $("input[name$='name']").val();
            let quote = $("input[name$='quote']").val();
            let that = this;

            if (name.length || quote.length) {
                let dataArticle = {
                    // id: curId,
                    name: name || undefined,
                    quote: quote || undefined
                };
                console.log(this);
                $.ajax({
                    type: "POST",
                    url: "http://localhost:3000/quotes",
                    data: dataArticle,
                    success: function (response) {
                        // console.log(this);
                        $("input[name$='name']").val('');
                        $("input[name$='quote']").val('');
                        $(that).removeAttr('disabled');

                    },
                    error: function (xhr, ajaxOptions, thrownError) {
                        alert(thrownError); //выводим ошибку
                    }
                });

            }
        });

        $("#addArticle").off("click");
    });


    //add article-----------------------------------------------------------------


    //update article-----------------------------------------------------------------

    $("main").on("click", '.update', function () {
        let target = $(this);
        let curId = target.parent().attr("id");
        // console.log(target);
        if (target.hasClass("opened")) return;
        target.addClass("opened");

        target.parent().append('  <form action="/quotes" method="POST" class="update-form">\n' +
            '    <input type="text" placeholder="name" name="name">\n' +
            '    <input type="text" placeholder="quote" name="quote">\n' +
            '    <button type="submit">Submit</button>\n' +
            '  </form>');

        $("button[type$='submit']").on("click", function (e) {
            e.preventDefault();

            $("button[type$='submit']").prop('disabled', true);

            let name = $("input[name$='name']").val();
            let quote = $("input[name$='quote']").val();
            let that = this;

            if (name.length || quote.length) {
                let dataArticle = {
                    id: curId,
                    name: name || undefined,
                    quote: quote || undefined
                };

                $.ajax({
                    type: "PATCH",
                    url: "http://localhost:3000/quotes/" + curId,
                    data: dataArticle,
                    success: function (response) {

                        // $("#responds").append(response);
                        $("input[name$='name']").val('');
                        $("input[name$='quote']").val('');
                        $(that).removeAttr('disabled');
                        target.removeClass("opened");

                    },
                    error: function (xhr, ajaxOptions, thrownError) {
                        alert(thrownError); //выводим ошибку
                    }
                });
            }

        });

    });

    //update article-----------------------------------------------------------------

    //delete article-----------------------------------------------------------------

    $("main").on("click", '.delete', function () {
        let deleteComment = $(this).parent();
        let id = deleteComment.attr('id');

        $.ajax({
            type: "DELETE",
            url: "http://localhost:3000/quotes/" + id,
            cache: false,
            success: function () {
                deleteComment.slideUp('slow', function () {
                    $(this).remove();
                });
            }

        });

    });

    //delete article-----------------------------------------------------------------

    // function showNewContent(arg) {
    //     $('arg').show('normal',hideLoader);
    //
    // }


});
