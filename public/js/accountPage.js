let token = localStorage.getItem("currentUser");
let greetName = localStorage.getItem("username");
function checkUser() {
  if (token) {
    $.ajax({
      url: "api/campaigns",
      headers: {
        Authorization: token
      },
      success: ()=> {
        greeting();
        $(".loader-background").remove();
        successLoad();
      },
      error: () => {
        location.href = "/login.html";
      }
    });
  } else {
    location.href = "/login.html";
  }
}
function greeting() {
  $(".greeting").append(`<h3>Welcome ${greetName}</h3>`);
}
function logout() {
  $(".side-bottom").on("click", function(e) {
    localStorage.clear();
    location.href = "/";
  });
}
function logoutMobil() {
  $(".side-btn.mobile").on("click", function(e) {
    localStorage.clear();
    location.href = "/";
  });
}
jQuery.fn.findNext = function(selector) {
  return this.eq(0).nextAll(selector).eq(0);
}
function renderLoader() {
    $(".js-content").append(`
    <div class ="loader-background">
      <div class="loader loader--style4" title="3">
      <h1>Loading</h1>
        <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
          width="100px" height="50px" viewBox="0 0 24 24" style="enable-background:new 0 0 50 50;" xml:space="preserve">
            <rect x="0" y="0" width="4" height="7" fill="#333">
              <animateTransform  attributeType="xml"
                attributeName="transform" type="scale"
                values="1,1; 1,3; 1,1"
                begin="0s" dur="0.6s" repeatCount="indefinite" />       
            </rect>
            <rect x="10" y="0" width="4" height="7" fill="#333">
              <animateTransform  attributeType="xml"
                attributeName="transform" type="scale"
                values="1,1; 1,3; 1,1"
                begin="0.2s" dur="0.6s" repeatCount="indefinite" />       
            </rect>
            <rect x="20" y="0" width="4" height="7" fill="#333">
              <animateTransform  attributeType="xml"
                attributeName="transform" type="scale"
                values="1,1; 1,3; 1,1"
                begin="0.4s" dur="0.6s" repeatCount="indefinite" />       
            </rect>
        </svg>
    </div>
  </div>`);
}
$(".sandwich-btn").on("click", function(e) {
  e.preventDefault();
  $(".btn-wrapper").toggleClass("active")
  .mouseleave(function() {
    $(this).fadeOut();
  });
  $(".btn-wrapper").css("display", "block");
});
function hideForm() {
  $(".js-create-fields").hide();
}
function showCreateFields() {
  $(".new-campaign").click(e => {
    e.preventDefault();
    navCheck();
    $(".campaigns-wrapper").empty();
    $(".campaign-section").hide();
    $(".js-create-fields").show();
    $(".btn-wrapper").toggleClass("active");
    $(".form-background").toggleClass("active");
    $(".create-campaign-btns-mobile").show();
    inputClear();
  });
}
$(".create-campaign-btns-mobile").hide();
function checkWindow() {
  $( window ).resize(function() {
    const win = $( window ).width();
    if (win >= 680) {
      $(".create-campaign-btns-mobile").remove();
    } else {
      if (win <= 679) {
        if($(".create-campaign-btns-mobile").length){
          if ($(".js-create-fields").is(':visible')){
            $(".create-campaign-btns-mobile").show();
          }
        }else {
          $(".create-campaign-btns-mobile").hide();
          $(".side-nav").append(`<div class="create-campaign-btns-mobile">
          <button class="create-btn-mobile add">Add Player</button>
          <button class="create-btn-mobile submit">Submit Campaign</button>
          </div>`);
        }
      }
    }
  });
}
function navCheck() {
  const win = $( window ).width();
  if (win >= 680) {
    $(".create-campaign-btns-mobile").remove();
  }
}
function addPlayer() {
  $(".add-player, .create-btn-mobile.add").click(e => {
    e.preventDefault();
    $("#players").append(`<div class="new-player">
        <button class="remove-player"><i class="fa fa-times" aria-hidden="true"></i></button><br />
        <label>Player Name</label> <br />
        <input class="player-name" required><br />
        <label>Stat Sheet</label><br />
        <input class="player-sheet" required><br />
        <label>Email</label><br />
        <input class="player-email" required><br />
        <label>Session</label><br />
        <input class="player-session" required><br />
        <label>Exp</label><br />
        <input class="player-exp" required><br />
        <label>Current Loot</label><br />
        <input class="player-loot">
    </div>`);
  });
}
$("#players").on("click", ".remove-player", function() {
  $(this)
    .parent()
    .remove();
});
function createSubmit() {
  $(".js-create-campaign").submit(function(e) {
    e.preventDefault();
    players = $.map($(".new-player"), function(item) {
      const name = $(item).find(".player-name")[0];
      const sheet = $(item).find(".player-sheet")[0];
      const email = $(item).find(".player-email")[0];
      const session = $(item).find(".player-session")[0];
      const exp = $(item).find(".player-exp")[0];
      const loot = $(item).find(".player-loot")[0];
      return {
        playerName: $(name).val(),
        statSheet: $(sheet).val(),
        email: $(email).val(),
        session: $(session).val(),
        expGained: $(exp).val(),
        currentLoot: $(loot).val()
      };
    });
    const dataToSend = {
      title: $("#title").val(),
      players: players
    };
    $.ajax({
      url: "/api/campaigns",
      headers: {
        Authorization: token
      },
      method: "POST",
      contentType: "application/json",
      dataType: "json",
      data: JSON.stringify(dataToSend),
      success: data => {
        inputClear();
        successDialogue();
      }
    });
  });
}
function mobileSubmit() {
  $(".create-btn-mobile.submit").on("click", function(e) {
    e.preventDefault();
    players = $.map($(".new-player"), function(item) {
      const name = $(item).find(".player-name")[0];
      const sheet = $(item).find(".player-sheet")[0];
      const email = $(item).find(".player-email")[0];
      const session = $(item).find(".player-session")[0];
      const exp = $(item).find(".player-exp")[0];
      const loot = $(item).find(".player-loot")[0];
      return {
        playerName: $(name).val(),
        statSheet: $(sheet).val(),
        email: $(email).val(),
        session: $(session).val(),
        expGained: $(exp).val(),
        currentLoot: $(loot).val()
      };
    });
    const dataToSend = {
      title: $("#title").val(),
      players: players
    };
    $.ajax({
      url: "/api/campaigns",
      headers: {
        Authorization: token
      },
      method: "POST",
      contentType: "application/json",
      dataType: "json",
      data: JSON.stringify(dataToSend),
      success: data => {
        inputClear();
        successDialogue();
      }
    });
  })
}
function inputClear() {
  $("#players").empty().append(`
    <div class="new-player">
    <label>Player Name</label>
    <input class="player-name" required>
    <label>Stat Sheet</label>
    <input class="player-sheet" required>
    <label>Email</label>
    <input class="player-email" required>
    <label>Session</label>
    <input class="player-session" required>
    <label>Exp</label>
    <input class="player-exp" required>
    <label>Current Loot</label>
    <input class="player-loot" >
</div>
    `);
  $("#title").val("");
}
function successDialogue() {
  $(".right-side").append(`
    <div class ="success-dialogue">
        <p>Success!</p>
        <p class="hint">(click to dismiss)</p>
    </div>
`);
  $(".success-dialogue").on("click", function() {
    $(this).remove();
    $(".campaign-btn").trigger("click");
  });
}
function successLoad() {
  navCheck();
  $(".js-create-fields").hide();
  $(".campaign-section").show();
  $(".create-campaign-btns-mobile").hide();
  $(".form-background").removeClass("active");
  $.ajax({
    url: "/api/campaigns",
    headers: {
      Authorization: token
    },
    method: "GET",
    contentType: "application/json",
    dataType: "json",
    data: {},
    success: data => {
      let res = data;
      deleteCampaign(res);
      editPlayers(res);
      renderCampaigns(res);
    }
  });
}
function loadCampaigns(res) {
  $(".campaign-btn").click(e => {
    e.preventDefault();
    navCheck();
    $(".js-create-fields").hide();
    $(".campaign-section").show();
    $(".create-campaign-btns-mobile").hide();
    $(".btn-wrapper").toggleClass("active");
    $(".form-background").removeClass("active");
    $.ajax({
      url: "/api/campaigns",
      headers: {
        Authorization: token
      },
      method: "GET",
      contentType: "application/json",
      dataType: "json",
      data: {},
      success: data => {
        let res = data;
        deleteCampaign(res);
        editPlayers(res);
        renderCampaigns(res);
      }
    });
  });
}

function renderCampaigns(res) {
  const campaignsHTML = res.map(
    item => `
    <section class="campaign" id="${item._id}" role="region">
      <h3 class="c-title"><i class="fa fa-chevron-left" aria-hidden="true"></i>${
        item.title
      }</h3>
      <nav class="campaign-buttons">
        <button class="save-campaign">
            <i class="fa fa-floppy-o" aria-hidden="true">
        </i><p>Save</p></button>
        <button class="edit-campaign">
            <i class="fa fa-pencil-square-o" aria-hidden="true">
        </i><p>Edit</p></button>
        <button class="delete-campaign">
            <i class="fa fa-trash" aria-hidden="true">
        </i><p>Delete Campaign</p></button>
        <button class="person-add">
            <i class="fa fa-plus-square" aria-hidden="true">
        </i><p>Add Player</p></button>
      </nav>
      <div class="campaign-players">
        ${item.players
          .map(
            (player, index) => `
        <div class="player-info">
        <button class="remove-player-btn">
            <i class="fa fa-trash" aria-hidden="true">
        </i><p>Remove Player</p></button>
          <h4>Player Name</h4>
              <label class="p-label">${player.playerName}</label>
              <input class="player-name js-hidden" value="${
                player.playerName
              }">
          <h4>Stat Sheet</h4>
              <label class="p-label">${player.statSheet}</label>
              <input class="player-sheet js-hidden" value="${
                player.statSheet
              }">
          <h4>Email</h4>
              <label class="p-label">${player.email}</label>
              <input class="player-email js-hidden" value="${
                player.email
              }">
          <h4>Session</h4>
              <label class="p-label">${player.session}</label>
              <input class="player-session js-hidden" value="${
                player.session
              }">
          <h4>Exp</h4>
              <label class="p-label">${player.expGained}</label>
              <input class="player-exp js-hidden" value="${
                player.expGained
              }">
          <h4>Current Loot</h4>
              <label class="p-label">${player.currentLoot}</label>
              <input class="player-loot js-hidden" value="${
                player.currentLoot
              }">
          </div>`
            )
            .join("")}
      </div>
    </section>
    `
  );
  $(".campaigns-wrapper").html(campaignsHTML);
  $(".campaigns-wrapper").append(`
    <button class="back-button">
        <i class="fa fa-chevron-left" aria-hidden="true"></i>
        Back
    </button>`);
  $(".back-button").hide();
  $(".person-add").hide();
  $(".campaign-players").hide();
  $(".remove-player-btn").hide();
  $(".campaign-buttons").hide();
  $(".fa-chevron-left").hide();
  $(".js-hidden").hide();
  $(".save-campaign").hide();
}

$(".campaigns-wrapper").on("click", ".c-title", function(e) {
  e.preventDefault();
  //TOGGLES CAMPAIGN BUTTONS LIKE EDIT AND DELETE
  $(this)
    .findNext(".campaign-buttons")
    .toggle();
    //SETS CAMPAIGN TO ACTIVE
  $(this)
    .parent()
    .toggleClass("active");
    //SHOWS CAMPAIGN PLAYERS
  $(this)
    .findNext(".campaign-players")
    .show()
    .toggleClass("active")
    .children()
    .toggleClass("active");
  $(".right-side").addClass("active");
  $(".campaign-section").addClass("active");
  $(".campaigns-wrapper").addClass("active");
  $(this).toggleClass("active");
  $(".fa-chevron-left").toggle();
  $(".save-campaign").hide();
  $(".person-add").hide();
});
$(".campaigns-wrapper").on("click", ".c-title.active", function(e) {
  $("campaign-players").removeClass("active");
  $(".right-side").removeClass("active");
  $(".campaign-section").removeClass("active");
  $(".campaigns-wrapper").removeClass("active");
});
function editPlayers(res) {
  $(".campaigns-wrapper").on("click", ".edit-campaign", function(e) {
    let id = $(this)
      .parent()
      .parent()
      .attr("id");
    let currentTitle = $(this)
      .parent()
      .siblings(".c-title")
      .text();
    let currentPlayers = $(this)
      .parent()
      .siblings(".campaign-players.active")
      .children();
    $(".js-hidden").toggle();
    $(".p-label").toggle();
    $(".back-button").toggle();
    $(".remove-player-btn").toggle();
    $(".person-add").toggle();
    $(this)
      .parent()
      .children(".person-add")
      .on("click", function() {
        $(this)
        .parent()
        .siblings(".campaign-players.active")
        .append(`
        <div class="player-info">
        <button class="remove-player-btn">
            <i class="fa fa-trash" aria-hidden="true">
        </i><p>Remove Player</p></button>
          <h4>Player Name</h4>
              <label class="p-label"></label>
              <input class="player-name js-hidden" value="">
          <h4>Stat Sheet</h4>
              <label class="p-label"></label>
              <input class="player-sheet js-hidden" value="">
          <h4>Email</h4>
              <label class="p-label"></label>
              <input class="player-email js-hidden" value="">
          <h4>Session</h4>
              <label class="p-label"></label>
              <input class="player-session js-hidden" value="">
          <h4>Exp</h4>
              <label class="p-label"></label>
              <input class="player-exp js-hidden" value="">
          <h4>Current Loot</h4>
              <label class="p-label"></label>
              <input class="player-loot js-hidden" value="">
          </div>`)
      });
    $(this)
      .parent()
      .children(".person-add")
      .on("click", function() {
        $(this)
        .parent()
        .siblings(".campaign-players.active")
        .children(".player-info")
        .addClass("active")
      });
    $(this)
      .prev()
      .toggle();
    e.preventDefault();
    $(".campaigns-wrapper").append(
      `<input class="title" value="${currentTitle}">`
    );
    $(this)
      .parent()
      .siblings(".c-title")
      .hide();
    $(this)
      .prev()
      .on("click", function() {
        let updatedPlayers = $(this)
        .parent()
        .siblings(".campaign-players.active")
        .children();
        $(".campaigns-wrapper").append(`
            <div class ="save-dialogue">
                <p>Save Changes?</p>
                <button class="confirm">Yes</button>
                <button class="cancel">No</button>
            </div>
        `);
        $(".confirm").on("click", function() {
         let updatedTitle = $(".title").val();
          players = $.map(updatedPlayers, function(item) {
            const name = $(item).find(".player-name")[0];
            const sheet = $(item).find(".player-sheet")[0];
            const email = $(item).find(".player-email")[0];
            const session = $(item).find(".player-session")[0];
            const exp = $(item).find(".player-exp")[0];
            const loot = $(item).find(".player-loot")[0];
            return {
              playerName: $(name).val(),
              statSheet: $(sheet).val(),
              email: $(email).val(),
              session: $(session).val(),
              expGained: $(exp).val(),
              currentLoot: $(loot).val()
            };
          });
          const updatedData = {
            _id: id,
            title: updatedTitle,
            players: players
          };
          $.ajax({
            url: `/api/campaigns/${id}`,
            headers: {
              Authorization: token
            },
            method: "PUT",
            contentType: "application/json",
            dataType: "json",
            data: JSON.stringify(updatedData),
            success: data => {
              $(".save-dialogue").remove();
              location.href = "/account.html";
            }
          });
        });
        $(".cancel").on("click", function() {
          $(".save-dialogue").remove();
        });
      });
  });
}
$(".campaigns-wrapper").on("click", ".back-button", function(e) {
  e.preventDefault();
  $(".right-side").removeClass("active");
  $(".campaign-section").removeClass("active");
  $(".campaigns-wrapper").removeClass("active");
  $(".campaign").removeClass("active");
  $(".player-info").removeClass("active");
  $(".back-button").hide();
  $(".campaign-buttons").hide();
  $(".title").remove();
  $(".c-title").show().removeClass("active");
  $(".fa-chevron-left").toggle();
  $(".js-hidden").toggle();
  $(".p-label").toggle();
  $(".remove-player-btn").toggle();
  $(".campaign-players").toggleClass("active");
});

$(".campaigns-wrapper").on("click", ".remove-player-btn", function(e) {
  e.preventDefault();
  $(this).parent().remove();
});

function deleteCampaign(res) {
  $(".campaigns-wrapper").on("click", ".delete-campaign", function() {
    let campId = $(this)
      .parent()
      .parent()
      .attr("id");
    $(".campaign-section").append(`
        <div class="delete-confirm">
            <p>Are you sure you want to delete this Campaign?</p>
            <button class="confirm">Yes</button>
            <button class="cancel">No</button>
        </div>
        `);
    $(".confirm").on("click", function() {
      $.ajax({
        url: `/api/campaigns/${campId}`,
        headers: {
          Authorization: token
        },
        method: "DELETE",
        success: () => {
          $(".campaigns-wrapper").empty();
          $(".delete-confirm").remove();
          $(".campaign-btn").trigger("click");
        },
        error: err => {}
      });
    });
    $(".cancel").on("click", function() {
      $(".delete-confirm").remove();
    });
  });
}

$(function() {
  renderLoader();
  checkUser();
  checkWindow();
  navCheck();
  logout();
  logoutMobil();
  hideForm();
  showCreateFields();
  createSubmit();
  mobileSubmit();
  addPlayer();
  loadCampaigns();
});
