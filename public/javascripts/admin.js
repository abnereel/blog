/*Common function*/


/*显示确认弹出框*/
function confirm(obj) {
   $("#confirm-a-href").val($(obj).attr("url"));
   $("#dialog-confirm").slideDown();
}