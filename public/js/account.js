let token = localStorage.getItem("currentUser");
let greetName = localStorage.getItem("username");
//function to render loader while the checkUser funciton works
function checkUser() {
  if (token) {
    $.ajax({
      url: "api/campaigns",
      headers: {
        Authorization: token
      },
      success: greeting(), //function to hide loader on successful check
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
    location.href = "/";
  });
}
function logoutMobil() {
  $(".side-btn.mobile").on("click", function(e) {
    location.href = "/";
  });
}
$(".sandwich-btn").on("click", function(e) {
  $(".btn-wrapper").toggleClass("active");
});
//Creat Campaign Functions
function hideForm() {
  $(".js-create-fields").hide();
}
function showCreateFields() {
  $(".new-campaign").click(e => {
    e.preventDefault();
    $(".campaigns-wrapper").empty();
    $(".campaign-section").hide();
    $(".js-create-fields").show();
    $(".btn-wrapper").toggleClass("active");
    inputClear();
  });
}
function addPlayer() {
  $(".add-player").click(e => {
    e.preventDefault();
    $("#players").append(`<div class="new-player">
        <button class="remove-player"><i class="fa fa-times" aria-hidden="true"></i></button><br />
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
      url: "/api/campaigns/create",
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
      },
      error: err => {
        console.error(err);
      }
    });
  });
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
//Read Functions
function loadCampaigns(res) {
  $(".campaign-btn").click(e => {
    e.preventDefault();
    $(".js-create-fields").hide();
    $(".campaign-section").show();
    $(".btn-wrapper").toggleClass("active");
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
      },
      error: err => {
        console.error(err);
      }
    });
  });
}

function renderCampaigns(res) {
  const campaignsHTML = res.map(
    item => `
        <section class="campaign" id="${item._id}" role="region">
            <nav class="campaign-buttons">
                <button class="save-campaign">
                    <i class="fa fa-floppy-o" aria-hidden="true">
                </i></button>
                <button class="edit-campaign">
                    <i class="fa fa-pencil-square-o" aria-hidden="true">
                </i></button>
                <button class="delete-campaign">
                    <i class="fa fa-trash" aria-hidden="true">
                </i></button>
            </nav>
            <h3 class="c-title"><i class="fa fa-chevron-left" aria-hidden="true"></i>${
              item.title
            }</h3>
            <div class="campaign-players">
                ${item.players
                  .map(
                    (player, index) => `
                <div class="player-info">
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
  $(".campaign-players").hide();
  $(".campaign-buttons").hide();
  $(".fa-chevron-left").hide();
  $(".js-hidden").hide();
  $(".save-campaign").hide();
}
$(".campaigns-wrapper").on("click", ".c-title", function(e) {
  e.preventDefault();
  $(this)
    .prev()
    .toggle();
  $(this)
    .parent()
    .toggleClass("active");
  $(this)
    .next()
    .show()
    .toggleClass("active");
  $(this)
    .next()
    .children()
    .toggleClass("active");
  $(".right-side").toggleClass("active");
  $(".campaign-section").toggleClass("active");
  $(".campaigns-wrapper").toggleClass("active");
  $(this).toggleClass("active");
  $(".fa-chevron-left").toggle();
});
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
  $(".c-title").show();
  $(".fa-chevron-left").toggle();
});
//Update functions
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
      .siblings(".campaign-players")
      .children();
    $(".js-hidden").toggle();
    $(".p-label").toggle();
    $(".back-button").toggle();
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
        $(".campaigns-wrapper").append(`
            <div class ="save-dialogue">
                <p>Save Changes?</p>
                <button class="confirm">Yes</button>
                <button class="cancel">No</button>
            </div>
        `);
        $(".confirm").on("click", function() {
          players = $.map(currentPlayers, function(item) {
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
            title: currentTitle,
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
            },
            error: err => {
              console.error(err);
            }
          });
        });
        $(".cancel").on("click", function() {
          $(".save-dialogue").remove();
        });
      });
  });
}

//Delete functions
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
        error: err => {
          console.error(err);
        }
      });
    });
    $(".cancel").on("click", function() {
      $(".delete-confirm").remove();
    });
  });
}

$(function() {
  checkUser();
  logout();
  logoutMobil();
  hideForm();
  showCreateFields();
  createSubmit();
  addPlayer();
  loadCampaigns();
  renderCampaigns();
});
