FROM kamasado/ubuntu_base

USER 0

RUN chown kamasado /app

USER kamasado

ADD image/startpoint.sh .
CMD ./startpoint.sh