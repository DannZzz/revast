import { Component, For, Match, Show, Switch } from "solid-js"
import "./Clans.scss"
import {
  ClanInformationDto,
  ClanVisualInformationDto,
} from "../../../../../socket/events"
import { socket } from "../../../../../socket/socket"
import { StrokeText } from "../../../../../components/StrokeText"

const Clans: Component<{
  clans?: ClanVisualInformationDto[]
  currentClan?: ClanInformationDto
  onClose: () => void
}> = ({ clans: visualClans, currentClan, onClose }) => {
  let clanName: HTMLInputElement

  return (
    <div class="clans-container">
      <div class="title-container">
        <img src="images/clans-title.png" alt="" class="title" />
      </div>

      <Switch>
        <Match when={currentClan}>
          <div class="clans">
            <img
              src="/images/out-button.png"
              alt=""
              onClick={onClose}
              class="out-button"
            />
            <div class="members">
              <StrokeText class="clan-title">{currentClan.name}</StrokeText>
              <div class="clans-list">
                <For each={currentClan.members}>
                  {(member) => (
                    <div class="member-flex">
                      <div class="btn-container">
                        <div
                          onClick={
                            member.id === currentClan.ownerId
                              ? null
                              : () =>
                                  socket.emit("requestClanMemberKick", [
                                    member.id,
                                  ])
                          }
                          class="btn-owner"
                          classList={{
                            kickable: member.id !== currentClan.ownerId,
                          }}
                        ></div>
                      </div>

                      <StrokeText class="member-name">{member.name}</StrokeText>
                    </div>
                  )}
                </For>
              </div>
            </div>
            <div class="buttons">
              <div
                class="privacy"
                classList={{ disabled: !currentClan.playerOwner }}
                onClick={(e) => {
                  currentClan.playerOwner &&
                    socket.emit("requestClanTogglePrivacy", [])
                }}
              >
                <StrokeText class="privacy-title">Clan Visibility</StrokeText>
                <div class="btn-checkbox">
                  <Show when={currentClan.joinPrivacy}>
                    <img src="/images/check.png" class="check" />
                  </Show>
                </div>
              </div>
              <div
                class="btn-leave"
                classList={{ delete: currentClan.playerOwner }}
                onClick={() => {
                  socket.emit("requestClanLeave", [])
                }}
              ></div>
            </div>
          </div>
        </Match>
        <Match when={visualClans}>
          <div class="clans big">
            <img
              src="/images/out-button.png"
              alt=""
              onClick={onClose}
              class="out-button"
            />
            <div class="clans-list">
              {visualClans.length > 0 ? (
                <For each={visualClans}>
                  {(clan) => (
                    <div class="visual-clan">
                      <div class="info">
                        <StrokeText class="clan-title">{clan.name}</StrokeText>
                        <span class="clan-member-count">
                          {clan.memberCount}
                        </span>
                      </div>
                      <div
                        onClick={() =>
                          socket.emit("requestClanJoin", [clan.id])
                        }
                        class="btn-join"
                      ></div>
                    </div>
                  )}
                </For>
              ) : (
                <span>Ooops! There's no clan yet!</span>
              )}
            </div>
            <div class="create-clan">
              <StrokeText class="create-clan-title">Create Clan</StrokeText>
              <input
                ref={clanName}
                placeholder="clan name.."
                type="text"
                class="clan-name"
                maxLength={20}
              />
              <div
                class="btn-create-clan"
                onClick={() =>
                  socket.emit("requestClanCreate", [clanName.value || ""])
                }
              ></div>
            </div>
          </div>
        </Match>
      </Switch>
    </div>
  )
}

export default Clans
