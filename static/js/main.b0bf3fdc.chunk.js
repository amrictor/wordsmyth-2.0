(this.webpackJsonpclient=this.webpackJsonpclient||[]).push([[0],[,,,,,,,,function(e){e.exports=JSON.parse('{"a":"server.amrictor.com:4444","b":true}')},,,,,,,function(e,t,a){e.exports=a(32)},,,,,function(e,t,a){},function(e,t,a){},function(e,t,a){},function(e,t,a){},,,function(e,t,a){},function(e,t,a){},function(e,t,a){},function(e,t,a){},function(e,t,a){},function(e,t,a){},function(e,t,a){"use strict";a.r(t);var n=a(1),s=a.n(n),r=a(10),i=a.n(r),o=(a(20),a(21),a(3)),c=a(4),u=a(2),l=a(6),d=a(5),m=a(7),h=(a(22),function(e){if(!e)return{};var t="#"===e.charAt(0)?e.substring(1,7):e;return{"--red":parseInt(t.substring(0,2),16),"--green":parseInt(t.substring(2,4),16),"--blue":parseInt(t.substring(4,6),16)}}),p=a(11),v=function(e){Object(l.a)(a,e);var t=Object(d.a)(a);function a(){return Object(o.a)(this,a),t.apply(this,arguments)}return Object(c.a)(a,[{key:"render",value:function(){var e=this,t=this.props.quote,a=t.beginning,n=t.end,r=t.votes,i=t.origin,o=t.publicPlayer,c=t.bonus,u=this.props.status,l=u.player,d=u.phase,v="quoteBlock "+(r?"results":"input");return s.a.createElement("div",{className:v},s.a.createElement("div",{className:"bonus_quote"},s.a.createElement("div",{className:"bonus ".concat((l.judge||3===d)&&c?"visible":"hidden"),title:o&&o.name+" got a bonus point for creativity!"},s.a.createElement(p.a,null)),s.a.createElement("button",{onClick:function(){return 3===d||e.props.sendRequest(e.props.quote)},disabled:this.props.disabled||r,className:"box ".concat(o&&o.judge?"correct":""),style:h(null===o||void 0===o?void 0:o.color)},s.a.createElement("div",{className:"quote"},o&&s.a.createElement("div",{className:"player"},o.name,s.a.createElement("span",{className:"judge",style:{visibility:o.judge?"visible":"hidden"}},s.a.createElement(m.a,null))),0===d&&s.a.createElement("div",{className:"origin"},i),a+"... "+n))),s.a.createElement("div",null,r&&s.a.createElement("div",{className:"votes"},r.map((function(e){return s.a.createElement("div",{title:o.judge?"".concat(e.name," voted for the correct quote!"):"".concat(e.name," voted for ").concat(o.name,"'s quote!"),id:e.name+"_vote",className:"vote",style:h(e.color)},e.name)})))))}}]),a}(n.Component),y=(a(23),function(e){Object(l.a)(a,e);var t=Object(d.a)(a);function a(){return Object(o.a)(this,a),t.apply(this,arguments)}return Object(c.a)(a,[{key:"render",value:function(){var e=this;return s.a.createElement("div",{className:"scores"},this.props.players.map((function(t){return s.a.createElement("div",{title:t.judge?t.name+" is the judge!":t.name,className:"score",style:h(t.color)},t.name,e.props.phase>-1&&" : ".concat(t.score),e.props.phase>-1&&s.a.createElement("span",{className:"judge",style:{visibility:t.judge?"visible":"hidden"}},s.a.createElement(m.a,null)," "))})))}}]),a}(n.Component)),b=a(14),g=a(12),f=a.n(g),j=(a(26),function(e){Object(l.a)(a,e);var t=Object(d.a)(a);function a(e){var n;return Object(o.a)(this,a),(n=t.call(this,e)).state={id:f.a.uniqueId("input_"),helperText:""},n.onChange=n.onChange.bind(Object(u.a)(n)),n}return Object(c.a)(a,[{key:"onChange",value:function(e){var t=this.props,a=t.pattern,n=t.min,s=t.max,r=t.message,i=e.target.value;a&&i&&!i.match(a)?this.setState({helperText:r||"Input is invalid."}):n&&i&&parseInt(i)<n?this.setState({helperText:"Value must be greater than or equal to ".concat(n)}):s&&i&&parseInt(i)>s?this.setState({helperText:"Value must be less than or equal to ".concat(s)}):this.setState({helperText:""}),this.props.onChange(e)}},{key:"render",value:function(){var e=this.props,t=e.label,a=e.id,n=(e.onChange,Object(b.a)(e,["label","id","onChange"]));return s.a.createElement("div",Object.assign({className:"wordsmyth_input",id:a},n),t&&s.a.createElement("label",{htmlFor:this.state.id},t),s.a.createElement("input",Object.assign({id:this.state.id,onChange:this.onChange},n)),this.state.helperText.length>0&&s.a.createElement("span",{className:"error"},this.state.helperText))}}]),a}(n.Component)),E=(a(27),function(e){Object(l.a)(a,e);var t=Object(d.a)(a);function a(e){var n;return Object(o.a)(this,a),(n=t.call(this,e)).state={quote:e.quote},n.setQuote=n.setQuote.bind(Object(u.a)(n)),n}return Object(c.a)(a,[{key:"setQuote",value:function(e){var t=this.props.quote;t.end=e.target.value,this.setState({quote:t})}},{key:"render",value:function(){var e=this;return s.a.createElement("div",{id:"writing"},s.a.createElement("div",{id:"beginning"},this.props.quote.beginning+"... "),s.a.createElement(j,{type:"text",id:"quoteEnd",disabled:this.props.disabled,onChange:this.setQuote}),s.a.createElement("button",{disabled:this.props.disabled,onClick:function(){e.props.sendRequest(e.state.quote)}},"Submit"))}}]),a}(n.Component)),k=(a(28),function(e){Object(l.a)(a,e);var t=Object(d.a)(a);function a(){return Object(o.a)(this,a),t.apply(this,arguments)}return Object(c.a)(a,[{key:"render",value:function(){var e=this.props.timer;return s.a.createElement("div",{className:"wordsmyth_timer"},s.a.createElement("div",{className:"timer",style:{width:"".concat(parseInt(e.time)/parseInt(e.total)*100,"%")}}))}}]),a}(n.Component)),O=(a(29),{"-1":{judge:"Waiting for more players to join!",players:"Waiting for more players to join!",first:"Click start whenever you're ready!"},0:{judge:"Choose one of these real quotes! Your friends will make up their own endings for the one you choose!",players:"Waiting for the judge to choose a quote now!"},1:{judge:"Waiting for your friends to write their own endings to the quote you've chosen!",players:"Finish the quote! Try to make it realistic so you can fool your friends. Here's a hint: check your spelling and punctuation!"},2:{judge:"While you wait for your friends to guess the correct quote, feel free to award some bonus points for creativity!",players:"Which quote do you think is the real one? Think carefully..."},3:{judge:"Let's see how everybody did!",players:"Let's see how everybody did!",first:"Click continue whenever you're ready!"},4:{judge:"Well done, everybody!",players:"Well done, everybody!"}}),q=function(e){Object(l.a)(a,e);var t=Object(d.a)(a);function a(e){var n;return Object(o.a)(this,a),(n=t.call(this,e)).sendRequest=n.sendRequest.bind(Object(u.a)(n)),n}return Object(c.a)(a,[{key:"sendRequest",value:function(e){if(e.target&&(e={}),this.props.status.expectedRequest){var t=this.props.status.expectedRequest;t.name=this.props.playerName,t.gameId=this.props.gameId,t.quote=e,this.props.sendObject(t)}}},{key:"getRound",value:function(e){var t=e.quotes||e.playerQuotes;return!!t&&s.a.createElement("div",null,0!==e.phase&&(t.length>0?s.a.createElement("div",{id:"quoteorigin"}," There's an old ",t[0].origin," saying: "):s.a.createElement("div",{id:"emptyquotes"}," Looks like no one submitted this round.",s.a.createElement("br",null)," Is everyone okay? ")),this.displayQuotes(e))}},{key:"displayQuotes",value:function(e){var t=this;return e.quotes?e.quotes.length>1?e.quotes.map((function(a){return s.a.createElement(v,{status:e,quote:a,sendRequest:t.sendRequest})})):s.a.createElement(E,{quote:e.quotes[0],disabled:!this.props.status.expectedRequest,sendRequest:this.sendRequest}):e.playerQuotes?e.playerQuotes.map((function(a){return s.a.createElement(v,{disabled:!t.props.status.expectedRequest,status:e,quote:a,sendRequest:t.sendRequest})})):void 0}},{key:"render",value:function(){var e=this.props,t=e.status,a=e.timer;return s.a.createElement("div",{id:"game"},s.a.createElement("div",{id:"header",style:h(t.player.color)},s.a.createElement("div",{id:"top"},s.a.createElement("div",{id:"title"},"Wordsmyth"),s.a.createElement("div",{id:"info"},s.a.createElement("div",{id:"username"},this.props.playerName,s.a.createElement("span",{className:"judge",title:"You're the judge this round!",style:{visibility:t.player.judge?"visible":"hidden"}},s.a.createElement(m.a,null))),s.a.createElement("div",{id:"gameid"},t.gameId))),a&&a.time>0&&s.a.createElement(k,{timer:a})),s.a.createElement("div",{id:"helperText"},O[t.phase][t.player.judge?"judge":"players"]),this.getRound(t),4===t.phase&&s.a.createElement("div",{id:"winner"},s.a.createElement("div",{style:h(t.players[0].color),className:"player"},t.players[0].name),"won!"),t.expectedRequest&&(-1===t.phase||3===t.phase)&&s.a.createElement("div",{id:"waiting"},O[t.phase].first,s.a.createElement("button",{onClick:this.sendRequest},t.expectedRequest.action)),this.props.status.players&&s.a.createElement(y,{phase:t.phase,players:this.props.status.players}),4===t.phase&&s.a.createElement("button",{onClick:this.sendRequest},t.expectedRequest.action),4===t.phase&&s.a.createElement("div",{style:{height:"30%"}}))}}]),a}(n.Component),C=a(13),N=(a(30),function(e){Object(l.a)(a,e);var t=Object(d.a)(a);function a(e){var n;return Object(o.a)(this,a),(n=t.call(this,e)).state={new:!0,username:"",rounds:3,timer:60,gameId:""},n.join=n.join.bind(Object(u.a)(n)),n.create=n.create.bind(Object(u.a)(n)),n}return Object(c.a)(a,[{key:"join",value:function(){var e={type:"request",action:"join",name:this.state.username,gameId:this.state.gameId};this.props.sendObject(e)}},{key:"create",value:function(){this.state.username&&""!==this.state.username||alert("Please enter a username!");var e={type:"request",action:"create",max_timer:this.state.timer,max_rounds:this.state.rounds,name:this.state.username};this.props.sendObject(e)}},{key:"setField",value:function(e,t){this.setState(Object(C.a)({},e,t))}},{key:"getInputs",value:function(){var e=this;return this.state.new?s.a.createElement("div",{id:"form"},s.a.createElement(j,{onChange:function(t){return e.setField("username",t.target.value)},value:this.state.username,type:"text",label:"Player's name"}),s.a.createElement("div",{id:"params"},s.a.createElement(j,{onChange:function(t){return e.setField("rounds",t.target.value)},value:this.state.rounds,type:"number",label:"Number of rounds",min:1,max:15}),s.a.createElement("div",{className:"spacer"}),s.a.createElement(j,{onChange:function(t){return e.setField("timer",t.target.value)},value:this.state.timer,type:"number",label:"Timer (in seconds)",min:30,max:360})),s.a.createElement("button",{onClick:this.create},"Create Game")):s.a.createElement("div",{id:"form"},s.a.createElement(j,{onChange:function(t){return e.setField("username",t.target.value)},value:this.state.username,type:"text",label:"Player's name"}),s.a.createElement(j,{onChange:function(t){return e.setField("gameId",t.target.value.toUpperCase())},value:this.state.gameId,type:"text",label:"Room code",pattern:/^[a-zA-Z0-9]{6}$/,message:"Game code must be alphanumeric and 6 characters long."}),s.a.createElement("button",{onClick:this.join},"Join Game"))}},{key:"render",value:function(){var e=this;return s.a.createElement("div",{id:"join"},s.a.createElement("div",{className:"nav"},s.a.createElement("div",{className:"navitem ".concat(this.state.new?"selected":""),onClick:function(){return e.setState({new:!0})}},"Start a new Game?"),s.a.createElement("div",{className:"navitem ".concat(this.state.new?"":"selected"),onClick:function(){return e.setState({new:!1})}},"Or join a friend's?")),this.getInputs())}}]),a}(n.Component)),w=a(8),I=(a(31),function(e){Object(l.a)(a,e);var t=Object(d.a)(a);function a(e){var n;return Object(o.a)(this,a),(n=t.call(this,e)).state={playerName:"",gameId:"",status:{}},n.connection=null,n.handleServerCommunication=n.handleServerCommunication.bind(Object(u.a)(n)),n.sendObject=n.sendObject.bind(Object(u.a)(n)),n.create=n.create.bind(Object(u.a)(n)),n.join=n.join.bind(Object(u.a)(n)),n.leave=n.leave.bind(Object(u.a)(n)),n}return Object(c.a)(a,[{key:"componentDidMount",value:function(){var e=this;this.mounted=!0;var t="ws".concat(w.b?"s":"","://").concat(w.a);this.connection=new WebSocket(t);var a=function(){console.log("Connected!")},n=function(e){console.log("WebSocket Error "+e),alert("Cannot reach server!")},s=function(t){var a=JSON.parse(t.data);e.handleServerCommunication(a)};this.connection.onopen=a,this.connection.onerror=n,this.connection.onmessage=s,this.connection.onclose=function r(){e.mounted&&(e.connection=new WebSocket(t),e.connection.onopen=a,e.connection.onerror=n,e.connection.onmessage=s,e.connection.onclose=r)},this.checkCookie()}},{key:"componentWillUnmount",value:function(){this.mounted=!1}},{key:"handleServerCommunication",value:function(e){switch(e.type){case"status":this.setState({status:e},document.documentElement.style.setProperty("--buttonColor",this.state.status.color));break;case"response":e.message?((e.message.includes("No game with code")||e.message.includes("Player does not exist"))&&this.setUser(),alert(e.message)):this.setUser(e);break;case"time":this.setState({timer:{time:e.time,total:e.total}});break;case"quit":this.setUser(),window.location.reload();break;default:alert(JSON.stringify(e))}}},{key:"setUser",value:function(e){var t=e||{playerName:"",gameId:""},a=t.playerName,n=t.gameId;this.setCookie(a,n,1),this.setState({playerName:a,gameId:n})}},{key:"sendObject",value:function(e){var t=this;!function e(a){setTimeout((function(){1===t.connection.readyState?null!=a&&a():e(a)}),5)}((function(){return t.connection.send(JSON.stringify(e))}))}},{key:"setCookie",value:function(e,t){var a=arguments.length>2&&void 0!==arguments[2]?arguments[2]:0,n=new Date;n.setTime(n.getTime()+60*a*1e3);var s=0===a?"":"max-age="+60*a*1e3+";path=/";document.cookie="playerName="+e+";"+s,document.cookie="gameId="+t+";"+s}},{key:"getCookie",value:function(e){for(var t=e+"=",a=document.cookie.split(";"),n=0;n<a.length;n++){for(var s=a[n];" "===s.charAt(0);)s=s.substring(1);if(0===s.indexOf(t))return s.substring(t.length,s.length)}return""}},{key:"checkCookie",value:function(){var e=this.getCookie("playerName"),t=this.getCookie("gameId");void 0!==e&&this.setState({playerName:e,gameId:t},this.requestStatus)}},{key:"requestStatus",value:function(){if("undefined"!==this.state.playerName&&"undefined"!==this.state.gameId){var e={type:"request",action:"status",name:this.state.playerName,gameId:this.state.gameId};this.sendObject(e)}}},{key:"create",value:function(){var e=document.getElementById("username").value;e&&""!==e||alert("Please enter a username!");var t={type:"request",action:"create",name:document.getElementById("username").value};this.sendObject(t)}},{key:"join",value:function(){var e={type:"request",action:"join",name:document.getElementById("username").value,gameId:document.getElementById("gameid").value};this.sendObject(e)}},{key:"leave",value:function(){var e={type:"request",action:"leave",name:this.state.playerName,gameId:this.state.gameId};this.sendObject(e)}},{key:"render",value:function(){return this.state.status.player?s.a.createElement(q,{status:this.state.status,timer:this.state.timer,sendObject:this.sendObject,playerName:this.state.playerName,gameId:this.state.gameId}):s.a.createElement(N,{sendObject:this.sendObject})}}]),a}(n.Component));var x=function(){return s.a.createElement("div",{className:"App"},s.a.createElement(I,null))};Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));i.a.render(s.a.createElement(x,null),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(e){e.unregister()})).catch((function(e){console.error(e.message)}))}],[[15,1,2]]]);
//# sourceMappingURL=main.b0bf3fdc.chunk.js.map