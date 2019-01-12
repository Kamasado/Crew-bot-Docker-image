FROM kamasado/ubuntu_base

USER 0

RUN git clone https://github.com/Kamasado/Crew-bot.git /app
RUN chown kamasado /app && yarn

USER kamasado

ADD image/startpoint.sh .
CMD ./startpoint.sh